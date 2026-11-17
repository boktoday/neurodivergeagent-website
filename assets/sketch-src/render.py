# -*- coding: utf-8 -*-
"""Render the two sketch diagrams and report any content that overflows its box."""
import os
import pathlib

from playwright.sync_api import sync_playwright

SRC = pathlib.Path(r"C:\Users\insig\AppData\Local\hermes\cache\scratch\sketch")
OUT = SRC / "out"
OUT.mkdir(exist_ok=True)

PAGES = [("family.html", "family-agent-sketch.png"), ("solo.html", "solo-agent-sketch.png")]


def main():
    with sync_playwright() as p:
        b = p.chromium.launch()
        for src, dest in PAGES:
            pg = b.new_page(viewport={"width": 2560, "height": 1440})
            pg.goto((SRC / src).as_uri(), wait_until="load")
            pg.wait_for_timeout(1400)          # let the webfonts settle

            # overflow check: any box whose content is taller than the box
            report = pg.evaluate("""() => {
              const bad = [];
              document.querySelectorAll('.box, .nav, .key, .guardian, .band').forEach(el => {
                if (el.scrollHeight > el.clientHeight + 2) {
                  bad.push({cls: el.className, over: el.scrollHeight - el.clientHeight,
                            text: (el.innerText || '').slice(0, 40).replace(/\\n/g, ' ')});
                }
                const r = el.getBoundingClientRect();
                if (r.bottom > 1440 || r.right > 2560) {
                  bad.push({cls: el.className, over: 'offscreen', text: (el.innerText||'').slice(0,40)});
                }
              });
              return bad;
            }""")

            pg.screenshot(path=str(OUT / dest))
            print("%-18s -> %-26s %s" % (src, dest,
                  "OK" if not report else "%d overflow(s)" % len(report)))
            for r in report:
                print("     ", r)
            pg.close()
        b.close()


if __name__ == "__main__":
    main()
