# Jamstain — Art Portfolio

An art portfolio built with **Astro** + **TypeScript**, with content managed in **Sanity Studio** (gallery artworks and store products are edited separately), and a lightweight path to selling store items via **Stripe Payment Links**.

The site runs and looks complete out of the box with sample placeholder artwork, even before Sanity/Web3Forms/Stripe are connected — see [Running without any setup](#running-without-any-setup).

## Stack

- [Astro](https://astro.build/) — static site generator, TypeScript-first
- [Sanity](https://www.sanity.io/) — headless CMS with separate **Gallery** and **Store** sections in Studio
- [Stripe Payment Links](https://stripe.com/payments/payment-links) — no-backend checkout, one link per store product
- [Web3Forms](https://web3forms.com/) — contact form submissions, no backend required

## Project structure

```
.
├── src/
│   ├── pages/
│   │   ├── index.astro          # Landing / hero page
│   │   ├── gallery/
│   │   │   ├── index.astro      # Gallery grid (artworks from Sanity — not for sale)
│   │   │   └── [slug].astro     # Individual artwork page
│   │   └── store/
│   │       ├── index.astro      # Store grid (products from Sanity)
│   │       └── [slug].astro     # Individual product page (price, Buy button)
│   ├── components/              # Header, Footer, ContactModal, Lightbox, ArtworkCard, ProductCard, BuyButton
│   ├── layouts/BaseLayout.astro
│   ├── lib/
│   │   ├── sanity.ts            # Sanity client + queries (falls back to mock-data.ts)
│   │   ├── mock-data.ts         # Sample placeholder artwork used until Sanity is connected
│   │   └── types.ts
│   └── styles/global.css
├── studio/                      # Sanity Studio (separate app — the client's editing UI)
│   ├── schemaTypes/
│   │   ├── artwork.ts           # Gallery pieces (title, image, medium, dimensions, etc.)
│   │   └── product.ts           # Store items (title, image, price, status, buy link)
│   └── sanity.config.ts
├── public/                      # Static assets (fonts, hero images)
├── .env.example                 # Copy to .env and fill in
└── astro.config.mjs
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (20 LTS recommended)

## Running without any setup

```bash
npm install
npm run dev
```

The site runs at <http://localhost:5173> with sample placeholder artwork (using the existing cat images) so you can see the full layout — gallery grid, lightbox, artwork detail pages, contact modal — before connecting anything. The gallery page shows a small red notice reminding you it's sample data.

The contact form works immediately too: without a Web3Forms key configured, submitting opens the visitor's email client with the message pre-filled, so nothing is ever silently lost.

## Setting up Sanity (content management)

This lets you (or your client) manage gallery artworks and store products separately — title, image, description, and (for store items) price and buy links — from a clean web UI, no code required.

1. Create a free account at [sanity.io](https://www.sanity.io/).
2. From the `studio/` folder, log in and initialize:
   ```bash
   cd studio
   npx sanity login
   npx sanity init --env
   ```
   When prompted, choose "Create new project," pick a project name, and use the existing schema (don't let it overwrite `schemaTypes/`). This writes your project ID into `studio/.env`.
3. Copy the same project ID into the root `.env` (copy `.env.example` to `.env` first):
   ```
   PUBLIC_SANITY_PROJECT_ID=your-project-id
   PUBLIC_SANITY_DATASET=production
   ```
4. Run the Studio locally to add artwork:
   ```bash
   npm run studio:dev
   ```
   This opens a Studio UI (usually at `http://localhost:3333`) with two sections:
   - **Gallery** — create artwork entries (image, title, medium, dimensions, year, description). Gallery pieces are never for sale.
   - **Store** — create product entries (image, title, description, price, in-stock/sold-out status, Stripe buy link).
5. Deploy the Studio so your client can use it from anywhere, without running anything locally:
   ```bash
   npm run studio:deploy
   ```
   This gives you a hosted URL like `https://your-project.sanity.studio` — bookmark that for your client.
6. Restart `npm run dev` at the project root — the site will now pull real artwork from Sanity instead of the sample data.

## Setting up the contact form (Web3Forms)

1. Go to [web3forms.com](https://web3forms.com/) and create a free access key with your email address (no signup required — the key is emailed to you).
2. In your root `.env`:
   ```
   PUBLIC_WEB3FORMS_KEY=your-access-key
   ```
3. Submissions will now be emailed to whatever address you registered the key with, with a success/error message shown in the modal. Web3Forms' free tier includes 250 submissions/month.

If you skip this step, the form still works — it just falls back to opening the visitor's default email app instead.

## Selling a store product (Stripe Payment Links)

No cart, no backend — each store product gets its own checkout link.

1. Create a free [Stripe](https://stripe.com) account.
2. In the Stripe Dashboard, go to **Payment Links** → **New** → create a product (name, price, and optionally its image).
3. Copy the generated link (e.g. `https://buy.stripe.com/...`).
4. In Sanity Studio, open the product under **Store**, set **Status** to "In stock," and paste the link into **Buy link (Stripe Payment Link)**.
5. The "Buy now" button on the product's page will go straight to Stripe checkout. Once it sells out, switch the Sanity status to "Sold out" — the button automatically becomes disabled.

If you later want an actual shopping cart (e.g. selling prints in multiple sizes/quantities), look at [Snipcart](https://snipcart.com/) or a [Shopify Buy Button](https://www.shopify.com/buy-button) — both can be embedded into this same Astro site without a rebuild.

## Build for production

```bash
npm run build   # type-checks, then builds to dist/
npm run preview # preview the production build locally
```

## Deploy

The `dist/` output is fully static:

- **Vercel** — import the repo, it auto-detects Astro. Add your `.env` variables in the project settings. Security headers (CSP, HSTS, etc.) are already configured in `vercel.json`.
- **Netlify** — connect the repo, build command `npm run build`, publish directory `dist`. You'll need to port the headers from `vercel.json` into a `netlify.toml` `[[headers]]` block instead — they don't read each other's config format.

Remember to set the same environment variables (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_WEB3FORMS_KEY`, `PUBLIC_CONTACT_EMAIL`, and any of the optional ones below) in your hosting provider's dashboard — `.env` files aren't committed to git.

## Pre-launch checklist

Things worth doing once, before pointing a real domain at this and turning on Stripe:

- [ ] **Security headers** — already set up in `vercel.json` (CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). If you add a new third-party script/embed later (e.g. an analytics tool, a Stripe embed instead of Payment Links), you'll need to add its domain to the relevant CSP directive or it'll get silently blocked.
  - **Do not remove `'unsafe-inline'` from `script-src`.** Astro inlines this site's page-specific `<script>` blocks (cat-scribble animation, contact modal, lightbox) directly into the HTML rather than as external files, so without `'unsafe-inline'` the browser silently blocks all of them — breaking navigation and the contact form with no visible error. Security scanners (e.g. Mozilla Observatory) flag this as a weakness and it's tempting to "fix," but doing so has broken the site twice already. The actual XSS risk it protects against doesn't apply here since the site never renders untrusted user content as raw HTML/JS. The real fix, if you want a better score, is switching to per-script SHA-256 hashes generated at build time — not simply deleting the keyword.
- [ ] **Lock down your Web3Forms key** — in the Web3Forms dashboard, restrict the access key to your production domain. It's shipped to the browser (`PUBLIC_WEB3FORMS_KEY`), so anyone could otherwise lift it and use it to send spam through your quota.
- [ ] **Sanity CORS** — in [sanity.io/manage](https://sanity.io/manage) → your project → API → CORS Origins, make sure only your real domain (and `http://localhost:*` for dev) are allowed — not a wildcard.
- [ ] **Error tracking (Sentry)** — create a free project at [sentry.io](https://sentry.io), then set `PUBLIC_SENTRY_DSN` in your env vars. Leave it unset and no Sentry code ships at all.
- [ ] **Analytics (Umami)** — point `PUBLIC_UMAMI_SRC` at your self-hosted instance's `script.js` and set `PUBLIC_UMAMI_WEBSITE_ID`. Once you have a domain, also add it to `script-src`/`connect-src` in `vercel.json`'s CSP, or the script will be blocked.
- [ ] **Sitemap & robots.txt** — already generated automatically at build (`@astrojs/sitemap`) and served from `public/robots.txt`. If you ever change the domain, update it in `astro.config.mjs` (`site`) and `public/robots.txt`.
- [ ] **Uptime monitoring** — something like [UptimeRobot](https://uptimerobot.com/) or [Better Uptime](https://betterstack.com/better-uptime) (free tiers) pinging the live site and emailing you if it goes down.
- [ ] **2FA everywhere** — GitHub, Vercel/Netlify, Sanity, Web3Forms, and (once connected) Stripe. This is the single highest-leverage security step for a solo dev.
- [ ] **Dependency updates** — turn on Dependabot (GitHub → Settings → Security) so dependency CVEs get flagged automatically, especially important once real payments are involved.
- [ ] **Stripe webhooks (only if you move beyond Payment Links)** — Payment Links need no backend and work as-is. If you later switch to Stripe Checkout Sessions with webhooks, that requires a server endpoint — this site is currently a fully static build (`output: "static"`, no adapter), so that'd mean adding a Vercel/Netlify serverless function or an Astro SSR adapter first.

## Customizing

- **Hero art / fonts** — assets live in `public/`, same filenames as before.
- **Colors & type** — CSS variables at the top of `src/styles/global.css`.
- **Adding a page** — add a new `.astro` file under `src/pages/`.

---

Made with care.
