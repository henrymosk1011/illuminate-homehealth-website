// Builds the static site into dist/. No dependencies, just Node 18+.
//   npm run build
import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE, SERVICES } from '../site/content/site.mjs';
import { render } from '../site/templates/layout.mjs';
import home from '../site/pages/home.mjs';
import { servicesIndex, servicePage } from '../site/pages/services.mjs';
import about from '../site/pages/about.mjs';
import { referrals, faq, contact, privacy, accessibility, notFound, thanks } from '../site/pages/other.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const site = join(root, 'site');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Static files
cpSync(join(site, 'assets'), join(out, 'assets'), {
  recursive: true,
  filter: (src) => !src.endsWith('photos.json'),
});
cpSync(join(site, 'public'), out, { recursive: true });

// Cache busting for CSS and JS: one hash of everything that ships as code
const hash = createHash('sha256');
for (const f of ['assets/css/main.css', 'assets/js/main.js', 'assets/vendor/gsap.min.js', 'assets/vendor/ScrollTrigger.min.js', 'assets/vendor/SplitText.min.js']) {
  hash.update(readFileSync(join(site, f)));
}
const now = new Date();
const ctx = {
  v: hash.digest('hex').slice(0, 10),
  year: now.getFullYear(),
};
const updated = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' });

// Logo mark paths, inlined in the home hero so each ray can animate
const markSvg = readFileSync(join(site, 'assets/img/mark.svg'), 'utf8');
const paths = [...markSvg.matchAll(/<path[^>]*?fill="([^"]+)"[^>]*?d="([^"]+)"/g)].map((m) => ({ fill: m[1], d: m[2] }));
if (paths.length !== 9) throw new Error(`Expected 9 paths in mark.svg, found ${paths.length}`);
const mark = { rays: paths.slice(0, 7), sun: paths[7], hand: paths[8] };

const pages = [
  home({ mark }),
  servicesIndex(),
  ...SERVICES.map((s, i) => servicePage(s, i)),
  about(),
  referrals(),
  faq(),
  contact(),
  privacy({ updated }),
  accessibility({ updated }),
  notFound(),
  thanks(),
];

for (const page of pages) {
  const file = page.file ? join(out, page.file) : join(out, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page, ctx));
}

// sitemap.xml
const isoDate = now.toISOString().slice(0, 10);
const indexable = pages.filter((p) => !p.noindex);
const priority = (p) => (p.path === '/' ? '1.0' : p.path.startsWith('/services/') ? '0.9' : p.id === 'legal' ? '0.3' : '0.7');
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${isoDate}</lastmod><priority>${priority(p)}</priority></url>`).join('\n')}
</urlset>
`,
);

writeFileSync(
  join(out, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /api/
Disallow: /thanks/

Sitemap: ${SITE.url}/sitemap.xml
`,
);

writeFileSync(
  join(out, 'site.webmanifest'),
  JSON.stringify(
    {
      name: SITE.name,
      short_name: 'Illuminate',
      start_url: '/',
      display: 'browser',
      background_color: '#FBF7F0',
      theme_color: '#FBF7F0',
      icons: [
        { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ),
);

// A plain text summary for AI assistants and search tools (llmstxt.org)
writeFileSync(
  join(out, 'llms.txt'),
  `# ${SITE.name}

> ${SITE.description}

Licensed home health agency (License No. ${SITE.license}) at ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.zip}.
Phone ${SITE.phone}. Fax ${SITE.fax}. Email ${SITE.email}.

## Services
${SERVICES.map((s) => `- [${s.name}](${SITE.url}/services/${s.slug}/): ${s.short}`).join('\n')}

## Pages
- [About](${SITE.url}/about/)
- [Physician referrals](${SITE.url}/referrals/)
- [Frequently asked questions](${SITE.url}/faq/)
- [Contact](${SITE.url}/contact/)
`,
);

if (!existsSync(join(out, 'favicon.ico'))) console.warn('warning: site/public/favicon.ico is missing');
console.log(`Built ${pages.length} pages into dist/ (assets v=${ctx.v})`);
