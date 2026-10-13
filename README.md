# NeuroDivergeAgent

> Two free AI agent profiles for neurodivergent people and the families who love them.
> One for the whole family. One for you alone.

- Website: https://neurodivergeagent.com
- The Family Agent (available now): https://github.com/boktoday/neurofamily-hermes-agent
- The Individual Agent: in development, join the waiting list on the website.

## What this repo is

The showcase website for the NeuroDivergeAgent project. Static HTML served from the repo root; the domain is hosted on Vercel.

- `index.html` - the whole site (single file, no build step)
- `assets/` - images
- `favicon.svg` - compass mark

## The two products

1. **The Family Agent (NeuroFamily Support Ecosystem)** - twelve specialist support skills for families raising neurodiverse children. Free, private, local-first, runs on Hermes Agent. Lives at boktoday/neurofamily-hermes-agent.
2. **The Individual Agent** - the same craft for one neurodivergent adult: routines, sensory life, work self-advocacy, burnout guardrails, life admin. In development. Will also be free.

## Deploy

Vercel, static, no framework. Push to `main` and the site updates. The domain `neurodivergeagent.com` is attached to the Vercel project.

## Form wiring (the only setup left)

Both forms on the page work today via email fallback. To switch them to direct delivery, set the `data-endpoint` attribute on each form in `index.html`:

- `#contact-form` - point at a webhook or form endpoint (JSON POST expected)
- `#newsletter-form` - point at the SendFox hosted form action URL

## Licence

The site content: PolyForm Noncommercial 1.0.0, free to use for noncommercial purposes with credit.

Required Notice: Copyright 2026 Brendan O'Keefe (https://neurodivergeagent.com)
