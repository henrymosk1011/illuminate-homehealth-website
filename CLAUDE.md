# Working in this repo

Website for Illuminate Home Health Care. See `README.md` for how the build, deployment, domain and contact form work.

## House rules for copy and design

- No dashes anywhere in visible copy, alt text, titles or meta descriptions (no hyphen, en dash or em dash). Phone numbers are written `(818) 987 4173`.
- No pulse dots or dot graphics; use the sun mark (`sun()` in `site/templates/layout.mjs`) as a separator.
- No lines or hyphens decorating headings.
- Keep it light themed, WCAG 2.2 AA, and working with reduced motion and without JavaScript.

## Before pushing

```bash
npm run build && npm run check
```

`check` must report 0 errors. Then load the site with `npm run dev` and confirm the change renders with no console errors.

## Shipping changes

Push finished, checked changes straight to `main`. Don't open a pull request or ask first. `main` is the production branch: the site is live at https://www.illuminatehomehealth.com, and pushes to `main` deploy through Cloudflare Workers Builds (Worker `illuminate-homehealth`, trigger "Production (main)").

After pushing, confirm a production build ran and succeeded (Cloudflare → Workers & Pages → illuminate-homehealth → Deployments). If no build started, start one on `main` by hand, then check the live site.
