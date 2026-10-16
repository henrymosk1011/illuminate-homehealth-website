# Illuminate Home Health Care: website

The website for Illuminate Home Health Care, Inc. in North Hollywood, CA (www.illuminatehomehealth.com).

It's a static site with a tiny build step (plain Node, no framework), hosted on **Cloudflare Workers** and deployed automatically from this GitHub repository. A small Worker script handles the contact form and sends each message to the clinic through **Resend**.

## What's on the site

| Page | Highlights |
| --- | --- |
| **Home** `/` | Sunrise hero: the logo's rays fan open around an arched photo and rotate as you scroll. Paragraph that "lights up" word by word. Counting stats. Pinned **horizontal scroll** of all ten services. Giant words that slide sideways in opposite directions. Sticky stacking value cards. Full bleed photo that opens up as it scrolls in. Pinned "how care begins" section where the sun arcs across the sky through four steps. Insurance partners, testimonials that glide sideways, physician referral block, FAQ |
| **Services** `/services/` | Every service as a large row; a photo follows the pointer on hover |
| **Service pages** `/services/<name>/` | One page per service (10 total) with what's included, who it helps, how to start, related services |
| **About** `/about/` | Story, numbers, values, team roles, office and communities served |
| **Referrals** `/referrals/` | How physicians and discharge planners refer patients, what to send, fax number |
| **FAQ** `/faq/` | Ten questions, marked up for Google's FAQ results |
| **Contact** `/contact/` | Accessible form (works with or without JavaScript), phone, fax, email, address |
| **Privacy**, **Accessibility**, **404**, **Thanks** | Supporting pages |

Footer on every page: big gradient wordmark, contact details, license number, `© <current year>` (updates itself every January) and **Designed by TENELEVENMEDIA** linking to tenelevenmedia.com.

### House rules (checked automatically)

- No dashes of any kind in visible copy: no hyphens, en dashes or em dashes. Write "follow up", not "follow-up", and phone numbers as `(818) 987 4173`.
- No pulse dots or dot graphics. The small sun from the logo is used as the separator instead.
- No lines or hyphens decorating headings.

`npm run check` scans every built page (text, alt text, titles, meta descriptions) and fails if a dash or dot glyph slips in. It also checks for one `h1` per page, alt text on every image, titles, descriptions and canonical links.

URL slugs such as `/services/skilled-nursing/` keep their hyphens on purpose: Google reads hyphens in URLs as word separators, so they help search ranking. They never appear in the page copy.

## Editing content

Almost everything you'll change lives in **`site/content/site.mjs`**:

- `SITE`: name, phone, fax, email, address, license number, service areas, insurance partners, Google Analytics ID
- `SERVICES`: the ten services (name, photo, summary, what's included, who it helps)
- `FAQS`, `TESTIMONIALS`, `VALUES`, `STEPS`, `STATS`, `TEAM_ROLES`

Page layouts are in `site/pages/*.mjs`; the shared header, footer and SEO tags are in `site/templates/layout.mjs`. Styles are in `site/assets/css/main.css` and all animation is in `site/assets/js/main.js`.

## Running locally

Requires Node 20.11 or newer.

```bash
npm run dev       # builds, then serves http://localhost:8787
npm run check     # house rules + SEO/accessibility checks on the build
```

`npm run dev` runs the real Worker code (`src/worker.js`) in Node, so the contact form works locally. Without a `RESEND_API_KEY` it runs in dry run mode: submissions are validated and logged to the terminal instead of emailed.

## How deployment works

```
GitHub (main) ──push──▶ Cloudflare Workers Builds ──npm run build──▶ npx wrangler deploy
```

The Cloudflare project is the Worker **`illuminate-homehealth`**, connected to this repository. Every push to `main` builds the site into `dist/` and deploys it. Configuration is in `wrangler.jsonc`:

- `dist/` is served by Workers Static Assets.
- `src/worker.js` runs first on every request to send `illuminatehomehealth.com` to `www.illuminatehomehealth.com`, handle `POST /api/contact`, and add security headers (CSP, HSTS, frame protection and more).
- A rate limiter allows 5 form submissions per minute per visitor.

## Moving the domain from GoDaddy to Cloudflare

The domain stays registered at GoDaddy. Only the DNS moves to Cloudflare.

1. **Cloudflare dashboard → Add a domain →** `illuminatehomehealth.com` (Free plan). Cloudflare copies the existing DNS records.
2. **Before switching anything,** compare the copied records with GoDaddy's DNS page and make sure the email records came over: every `MX` record, the SPF `TXT` record (`v=spf1 ...`), any DKIM and DMARC records. Email for `contact@illuminatehomehealth.com` depends on them.
3. **GoDaddy → My Products → illuminatehomehealth.com → DNS → Nameservers → Change → "I'll use my own nameservers"** and enter the two nameservers Cloudflare shows (for this account they are `kira.ns.cloudflare.com` and `viddy.ns.cloudflare.com`).
4. Wait for Cloudflare to show the domain as **Active** (usually under an hour, sometimes up to 24).
5. **Go live:** in `wrangler.jsonc`, uncomment the `routes` block for `www.illuminatehomehealth.com` and `illuminatehomehealth.com` and push to `main`. (Or Cloudflare dashboard → Workers → illuminate-homehealth → Settings → Domains → Add custom domain, for both names.) Cloudflare replaces the old Webflow `A`/`CNAME` records for those two names and issues the SSL certificate automatically.
6. Once the new site is live, unpublish the Webflow site and remove its custom domain.

## Contact form email (Resend)

The form sends from a dedicated subdomain, `forms.illuminatehomehealth.com`, so website mail never affects the clinic's main email reputation (same setup as Starlight).

1. **Resend → Domains → Add domain →** `forms.illuminatehomehealth.com` (needs the plan upgrade for more domains).
2. Add the DNS records Resend lists (a DKIM `TXT`, plus `MX` and SPF `TXT` records on `send.forms`) in Cloudflare DNS (or GoDaddy, if the nameservers haven't moved yet), then click **Verify**.
3. **Resend → API Keys → Create** a key with *Sending access* limited to that domain.
4. Store it as a secret on the Worker (never commit it):
   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```
   or Cloudflare dashboard → Workers → illuminate-homehealth → Settings → Variables and Secrets → Add → Secret.
5. Send a test message from the contact page. It arrives at `contact@illuminatehomehealth.com`; replying goes straight to the person who wrote in.

Until the key is set, the form shows a friendly error with the phone number and email instead of failing silently. To change who receives messages, edit `CONTACT_TO` in `wrangler.jsonc` (comma separate multiple addresses).

The form asks people not to include detailed medical information, since regular email is not a HIPAA compliant channel.

## Google Analytics

Set `gaId` in `site/content/site.mjs` to the GA4 measurement ID (`G-XXXXXXX`) and push. The tag loads on every page and the security policy in `src/worker.js` already allows Google's analytics hosts. Then submit `https://www.illuminatehomehealth.com/sitemap.xml` in Google Search Console.

## SEO built in

- Unique title, description, canonical URL, Open Graph and Twitter card on every page, plus a 1200×630 share image
- Structured data: `MedicalBusiness` (address, phone, fax, services, service areas, license), `WebSite`, `BreadcrumbList`, `Service` for each service page, `FAQPage`, `ItemList`
- `sitemap.xml`, `robots.txt` and `llms.txt` generated on every build
- Fast loading: self hosted fonts, AVIF and WebP photos in several sizes, lazy loading, cache busting, no render blocking scripts

## Accessibility (WCAG 2.2 AA)

- Tested with axe-core on every page at desktop and mobile sizes, with motion on and off: no violations
- Skip link, landmarks, logical heading order, visible focus rings, full keyboard support (focusing a card in the horizontal section scrolls it into view)
- Colour contrast tuned for every text colour on every background
- Mobile menu is a native modal dialog (focus is trapped, Escape closes it, focus returns to the button)
- Form fields have visible labels, required markers, inline errors announced to screen readers
- **Reduce motion:** with the system setting on, pinning, scroll effects and animations are switched off and the page is a calm static layout
- Content works without JavaScript, reflows at 320px wide and at 400% zoom
- Accessibility statement at `/accessibility/`

## Please confirm with Illuminate

These came from the old Webflow site or are reasonable assumptions; worth a quick check before launch:

- **Testimonials** (Martha J., John W., Sabina M.): confirm they're real patient quotes and that the patients are OK being quoted. Remove any that aren't.
- **Numbers:** 400+ patients, 10+ years, 20+ staff (from the old About page).
- **Service areas** listed on the About page.
- **Insurance partners:** Blue Shield of California, UnitedHealthcare, Carelon.
- **Fax:** (818) 235 0135. **License:** 550005596.

## Image credits

Photos are from Illuminate's existing Webflow library and from [Unsplash](https://unsplash.com/license) (free for commercial use): Age Cymru (nurse, walker, coloring, laughing, dancing, two women), Vitaly Gariev (clinician visits, consultations, family exercise), Miles Burke (pill organizer). Logo vectorized from the original artwork.

GSAP 3.13 (with ScrollTrigger and SplitText) is self hosted under the [GSAP standard license](https://gsap.com/standard-license), free for commercial sites.

## Files

```
site/content/site.mjs     ← business info, services, FAQs, testimonials
site/pages/               page layouts
site/templates/layout.mjs head (SEO), header, footer, shared blocks
site/assets/css/main.css  all styles
site/assets/js/main.js    animation and interactions
site/assets/img/          logo (SVG), icons, photos (AVIF + WebP), share image
site/public/              files copied to the site root (favicon.ico, apple touch icon)
scripts/build.mjs         builds dist/ with sitemap, robots.txt, manifest, llms.txt
scripts/check.mjs         house rules + SEO/accessibility checks
scripts/serve.mjs         local preview running the real Worker
src/worker.js             Cloudflare Worker: contact form, redirects, security headers
wrangler.jsonc            Cloudflare configuration
```
