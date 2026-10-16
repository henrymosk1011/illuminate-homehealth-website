// House rules and basic SEO/accessibility checks for the built site.
//   npm run build && npm run check
// Fails on: any dash or dot glyph in visible copy, images without alt, pages without exactly one h1,
// missing titles or descriptions. Warns on long titles and descriptions.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist');
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(dist);

// hyphen, non breaking hyphen, figure dash, en dash, em dash, horizontal bar, minus, small/fullwidth hyphens
const DASHES = /[-‐‑‒–—―−﹘﹣－]/;
// bullets and dot glyphs used as decoration
const DOTS = /[•·●◦∙‧⋅⦁⚫⚪]/;

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

let errors = 0;
let warnings = 0;
const fail = (file, msg) => {
  errors++;
  console.error(`  ✗ ${relative(dist, file)}: ${msg}`);
};
const warn = (file, msg) => {
  warnings++;
  console.warn(`  ! ${relative(dist, file)}: ${msg}`);
};

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

  // Visible text
  const body = noScripts.slice(noScripts.indexOf('<body'));
  const text = decode(body.replace(/<svg[\s\S]*?<\/svg>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  // Text that people read in attributes and in search results
  const attrs = [...noScripts.matchAll(/\s(alt|title|aria-label|placeholder|content)="([^"]*)"/g)]
    .filter(([, name, value]) => !(name === 'content' && /^(width=|index|noindex|telephone=|light|#|https?:|\d)/.test(value)))
    .map(([, name, value]) => [name, decode(value)]);
  const titleTag = decode((noScripts.match(/<title>([^<]*)<\/title>/) || [])[1] || '');

  for (const [label, value] of [['text', text], ['title', titleTag], ...attrs]) {
    const m = value.match(DASHES);
    if (m) {
      const i = value.indexOf(m[0]);
      fail(file, `dash in ${label}: "…${value.slice(Math.max(0, i - 40), i + 40).trim()}…"`);
    }
    const dot = value.match(DOTS);
    if (dot) fail(file, `dot glyph "${dot[0]}" in ${label}`);
    if (/lorem ipsum/i.test(value)) fail(file, `placeholder text in ${label}`);
  }

  // Images need alt text (empty alt is fine for decorative images)
  for (const img of noScripts.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(img[0])) fail(file, `img without alt: ${img[0].slice(0, 80)}`);
  }

  const h1s = (noScripts.match(/<h1\b/g) || []).length;
  if (h1s !== 1) fail(file, `expected one h1, found ${h1s}`);

  if (!titleTag) fail(file, 'missing <title>');
  else if (titleTag.length > 70) warn(file, `title is ${titleTag.length} characters`);

  const desc = (noScripts.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!desc) fail(file, 'missing meta description');
  else if (desc.length > 165) warn(file, `description is ${desc.length} characters`);

  if (!/<html lang="/.test(html)) fail(file, 'missing lang attribute');
  if (!/<link rel="canonical"/.test(html)) fail(file, 'missing canonical link');

  // Heading levels should not skip (h2 straight to h4)
  let prev = 1;
  for (const h of noScripts.matchAll(/<h([1-6])\b/g)) {
    const level = Number(h[1]);
    if (level > prev + 1) warn(file, `heading jumps from h${prev} to h${level}`);
    prev = level;
  }
}

console.log(`\nChecked ${files.length} pages: ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
