# Jasmine Wu — Art Portfolio

An art portfolio built with **Astro** + **TypeScript**, with artwork content managed in **Sanity Studio** (so the artist/client can add, edit, and price pieces without touching code), and a lightweight path to selling individual pieces via **Stripe Payment Links**.

The site runs and looks complete out of the box with sample placeholder artwork, even before Sanity/Web3Forms/Stripe are connected — see [Running without any setup](#running-without-any-setup).

## Stack

- [Astro](https://astro.build/) — static site generator, TypeScript-first
- [Sanity](https://www.sanity.io/) — headless CMS for artwork content (Studio lives in `studio/`)
- [Stripe Payment Links](https://stripe.com/payments/payment-links) — no-backend checkout, one link per artwork
- [Web3Forms](https://web3forms.com/) — contact form submissions, no backend required

## Project structure

```
.
├── src/
│   ├── pages/
│   │   ├── index.astro          # Landing / hero page
│   │   └── works/
│   │       ├── index.astro      # Gallery grid (reads artworks from Sanity)
│   │       └── [slug].astro     # Individual artwork page (description, price, Buy button)
│   ├── components/              # Header, Footer, ContactModal, Lightbox, ArtworkCard, BuyButton
│   ├── layouts/BaseLayout.astro
│   ├── lib/
│   │   ├── sanity.ts            # Sanity client + queries (falls back to mock-data.ts)
│   │   ├── mock-data.ts         # Sample placeholder artwork used until Sanity is connected
│   │   └── types.ts
│   └── styles/global.css
├── studio/                      # Sanity Studio (separate app — the client's editing UI)
│   ├── schemaTypes/artwork.ts   # Fields: title, image, price, status, buy link, etc.
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

The site runs at <http://localhost:5173> with sample placeholder artwork (using the existing cat images) so you can see the full layout — gallery grid, lightbox, artwork detail pages, contact modal — before connecting anything. The works page shows a small red notice reminding you it's sample data.

The contact form works immediately too: without a Web3Forms key configured, submitting opens the visitor's email client with the message pre-filled, so nothing is ever silently lost.

## Setting up Sanity (content management)

This lets you (or your client) add/edit artwork — title, image, price, sold status, description — from a clean web UI, no code required.

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
   This opens a Studio UI (usually at `http://localhost:3333`) where you can create "Artwork" entries: upload an image, set title/medium/dimensions/year, write a description, mark it Available/Sold/Not for sale, and (if available) set a price and paste a Stripe Payment Link.
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

## Selling a piece (Stripe Payment Links)

No cart, no backend — each artwork gets its own checkout link.

1. Create a free [Stripe](https://stripe.com) account.
2. In the Stripe Dashboard, go to **Payment Links** → **New** → create a product for the piece (name, price, and optionally its image), set quantity limit to 1 for one-of-a-kind pieces.
3. Copy the generated link (e.g. `https://buy.stripe.com/...`).
4. In Sanity Studio, open that artwork, set **Status** to "Available," and paste the link into **Buy link (Stripe Payment Link)**.
5. The "Buy this piece" button on the artwork's page will now go straight to Stripe checkout. Once it sells, switch the Sanity status to "Sold" — the button automatically becomes disabled and shows "Sold."

If you later want an actual shopping cart (e.g. selling prints in multiple sizes/quantities), look at [Snipcart](https://snipcart.com/) or a [Shopify Buy Button](https://www.shopify.com/buy-button) — both can be embedded into this same Astro site without a rebuild.

## Build for production

```bash
npm run build   # type-checks, then builds to dist/
npm run preview # preview the production build locally
```

## Deploy

The `dist/` output is fully static:

- **Vercel** — import the repo, it auto-detects Astro. Add your `.env` variables in the project settings.
- **Netlify** — connect the repo, build command `npm run build`, publish directory `dist`.

Remember to set the same environment variables (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_WEB3FORMS_KEY`, `PUBLIC_CONTACT_EMAIL`) in your hosting provider's dashboard — `.env` files aren't committed to git.

## Customizing

- **Hero art / fonts** — assets live in `public/`, same filenames as before.
- **Colors & type** — CSS variables at the top of `src/styles/global.css`.
- **Adding a page** — add a new `.astro` file under `src/pages/`.

---

Made with care.
