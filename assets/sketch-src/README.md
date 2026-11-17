# Sketch source

The two team diagrams in `assets/` are rendered from these HTML files, not drawn by hand.

- `family.html` renders `../family-agent-sketch.png`
- `solo.html` renders `../solo-agent-sketch.png`
- `render.py` renders both at 2560x1440 and reports any content that overflows its box

To update a count or add a skill: edit the relevant HTML, then run

```
python render.py
```

It writes the PNGs into `../` and prints `OK` per diagram, or lists the boxes whose content no longer fits. Adjust the box `height` in the inline style until it reports OK.

Keep the canvas at 2560x1440: the site reserves a 16:9 slot for these images.
