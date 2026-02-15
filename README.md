# Disc-Go-Round

A full-stack disc golf e-commerce platform built with Next.js 16 and React 19. Browse, search, and purchase disc golf discs with Stripe-powered checkout, persistent cart, and user authentication.

---

## Tech Stack

### Core

| Technology | Version | What it does |
|---|---|---|
| **Next.js** | 16 | App Router framework — handles routing, server-side rendering, API routes, and image optimization. Chosen for its file-based routing and server component support which keeps the client bundle small. |
| **React** | 19 | UI rendering. v19 gives us server components by default and improved form handling. |
| **TypeScript** | 5 | Static type safety across the entire codebase. Every schema, API response, and component prop is typed. |

### Database & Auth

| Technology | Version | What it does |
|---|---|---|
| **MongoDB** | (Atlas) | Document database. Stores products, users, and orders. Chosen because the flexible schema maps naturally to product variants (different discs have different attributes like flight numbers, plastic type, weight). |
| **Mongoose** | 8 | ODM for MongoDB — defines schemas, handles validation, and manages the connection pool. Uses a global cache to prevent connection leaks in serverless environments. |
| **NextAuth** | 5 (beta) | Authentication library. Handles sign-in/sign-up with credentials (email + password), JWT session tokens, and protected routes. Integrates directly with the App Router. |
| **bcryptjs** | 3 | Password hashing. Salts and hashes passwords before storing them in MongoDB so plaintext passwords never touch the database. |

### Payments

| Technology | Version | What it does |
|---|---|---|
| **Stripe** | 20 (server) | Payment processing. Creates Checkout Sessions server-side, verifies payments, and sends webhook events. We use Stripe's hosted checkout page so we never handle raw card data. |
| **@stripe/stripe-js** | 8 (client) | Client-side Stripe loader. Used for redirecting the user to Stripe's hosted checkout page. |

### State Management

| Technology | Version | What it does |
|---|---|---|
| **Zustand** | 5 | Client-side state for the shopping cart. Lightweight alternative to Redux — a single store file handles add/remove/update/clear with automatic price recalculation. Uses the `persist` middleware to save cart state to `localStorage` so it survives page refreshes and browser restarts. |

### UI & Styling

| Technology | Version | What it does |
|---|---|---|
| **Tailwind CSS** | 4 | Utility-first CSS framework. All styling is done with class names directly in JSX — no separate CSS files to maintain. v4 uses the new PostCSS-based engine. |
| **shadcn/ui** | — | Pre-built accessible components (Button, Input, Select, Accordion, Carousel, AlertDialog). Not a dependency — components are copied into `components/ui/` and owned by the project, so they're fully customizable. Built on Radix UI primitives. |
| **Radix UI** | — | Headless, accessible UI primitives that power the shadcn/ui components. Handles keyboard navigation, focus management, and ARIA attributes. |
| **Lucide React** | 0.539 | Icon library. Provides consistent SVG icons used in the header, product cards, and buttons. |
| **Embla Carousel** | 8 | Lightweight carousel engine for the homepage hero banners. Supports autoplay, touch/swipe, and infinite scroll. |

### Validation

| Technology | Version | What it does |
|---|---|---|
| **Zod** | 4 | Schema validation used everywhere — form validation on the client, request body validation in API routes, and type inference for TypeScript. A single schema definition in `lib/validator.ts` generates both runtime validation and static types. |
| **Class Variance Authority** | 0.7 | Manages component variant styles (e.g., button sizes, colors). Used by shadcn/ui's `Button` component to map props like `variant="outline"` to Tailwind classes. |

### Dev Tools

| Technology | What it does |
|---|---|
| **Turbopack** | Next.js bundler used in development (`next dev --turbopack`). Faster hot module replacement than Webpack. |
| **ESLint** | Linting with `eslint-config-next`. Catches common React and Next.js mistakes. |
| **tw-animate-css** | Tailwind plugin that adds CSS animation utilities for enter/exit transitions. |

---

## Project Structure

```
app/
├── layout.tsx                          # Root layout (Geist fonts, global providers)
├── globals.css                         # Tailwind theme config (oklch colors)
├── signin/page.tsx                     # Sign-in page
├── signup/page.tsx                     # Sign-up page
├── api/
│   ├── auth/[...nextauth]/route.ts     # NextAuth API handler
│   ├── auth/register/route.ts          # User registration endpoint
│   ├── checkout/route.ts               # Creates Stripe Checkout Sessions
│   ├── orders/route.ts                 # Verifies payment + creates orders
│   └── webhooks/stripe/route.ts        # Stripe webhook (backup order creation)
└── (home)/                             # Route group — shared header/footer layout
    ├── layout.tsx                      # Header + Footer wrapper
    ├── page.tsx                        # Homepage with carousel
    ├── products/page.tsx               # Product listing (paginated)
    ├── search/page.tsx                 # Search + filter
    ├── product/[slug]/page.tsx         # Product detail page
    ├── cart/page.tsx                   # Shopping cart
    └── checkout/
        ├── page.tsx                    # Shipping form + order summary
        └── success/page.tsx            # Order confirmation

components/
├── shared/
│   ├── header/                         # Nav bar, search bar, cart badge
│   ├── product/product-card.tsx        # Disc card with flight numbers
│   ├── cart/                           # Cart item row, summary, add-to-cart button
│   ├── checkout/shipping-form.tsx      # Shipping address form
│   └── home/home-carousel.tsx          # Hero carousel
└── ui/                                 # shadcn/ui components (Button, Input, etc.)

lib/
├── constants.ts                        # App name, slogan, description
├── data.ts                             # Seed data (products, carousels)
├── utils.ts                            # cn(), formatNumberWithDecimal(), toSlug()
├── validator.ts                        # All Zod schemas (Product, Order, User, Cart, etc.)
├── stripe.ts                           # Stripe server-side client
├── db/
│   ├── index.tsx                       # MongoDB connection (cached for serverless)
│   ├── seed.ts                         # Database seeder script
│   └── models/
│       ├── product.model.ts            # Product schema (disc-specific fields)
│       ├── user.model.ts               # User schema (bcrypt password hashing)
│       └── order.model.ts              # Order schema (Stripe session tracking)
└── store/
    └── cart-store.ts                   # Zustand cart (persist to localStorage)

types/
└── index.ts                            # TypeScript types inferred from Zod schemas
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (comes with Node)
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- A **Stripe** account ([sign up free](https://dashboard.stripe.com/register))

### 1. Clone and install

```bash
git clone <your-repo-url>
cd disc-golf-ecom
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Auth (generate with: npx auth secret)
AUTH_SECRET="your-auth-secret-here"

# MongoDB
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>"

# Stripe (from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**To get Stripe keys:**
1. Go to [Stripe Dashboard > Developers > API keys](https://dashboard.stripe.com/test/apikeys)
2. Copy the **Publishable key** and **Secret key**
3. For the webhook secret, see step 5 below

### 3. Seed the database

```bash
npm run seed
```

This populates MongoDB with ~45 disc golf products (flight numbers, images, ratings, etc.).

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Set up Stripe webhooks (for local development)

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli), then:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This prints a webhook signing secret (`whsec_...`) — copy it into your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### 6. Test a purchase

1. Add items to your cart
2. Go to `/checkout`, fill in shipping info
3. Click "Pay Now" — you'll be redirected to Stripe
4. Use test card: `4242 4242 4242 4242`, any future expiry, any CVC
5. After payment, you'll see the order confirmation page

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample products |

---

## How to Add a New Feature

This walks through the process of adding a feature end-to-end, using the patterns already established in the codebase.

### Example: Adding a "Wishlist" feature

**1. Define the schema** (`lib/validator.ts`)

Start here. Zod schemas are the single source of truth for data shape and validation. They generate TypeScript types automatically.

```ts
export const WishlistItemSchema = z.object({
  product: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().min(1),
  price: Price('Price'),
})
```

**2. Export the type** (`types/index.ts`)

```ts
export type WishlistItem = z.infer<typeof WishlistItemSchema>
```

**3. Create the database model** (if server-persisted) (`lib/db/models/wishlist.model.ts`)

Follow the pattern in `product.model.ts` — define a Mongoose schema that mirrors your Zod schema, use `models.X || model()` to prevent model recompilation in dev.

**4. Create the client store** (if client-side state needed) (`lib/store/wishlist-store.ts`)

Follow `cart-store.ts` — Zustand with `persist` middleware for localStorage. Keep the store flat: state + actions in one `create()` call.

**5. Build the UI component** (`components/shared/wishlist/`)

- Use existing shadcn/ui primitives from `components/ui/`
- Import types from `types/index.ts`
- Client components need the `'use client'` directive at the top
- Use `cn()` from `lib/utils` for conditional class names

**6. Create the page** (`app/(home)/wishlist/page.tsx`)

Place it inside `(home)/` to inherit the header/footer layout. Use the `Vortex` background component for visual consistency with other pages.

**7. Add API routes** (if needed) (`app/api/wishlist/route.ts`)

- Validate request bodies with your Zod schema: `Schema.safeParse(body)`
- Connect to the database with `await connectionToDatabase()`
- Return `NextResponse.json()`

**8. Wire it up**

- Add a link/button in the header (`components/shared/header/menu.tsx`)
- Add "Add to Wishlist" button on the product page

### Key patterns to follow

- **Validation:** Always validate with Zod on the server, even if the client already validated. Never trust client-sent prices — recalculate server-side.
- **Database connection:** Always call `await connectionToDatabase()` before any Mongoose operation in API routes.
- **Models:** Use `(models.X as Model<IX>) || model<IX>('X', schema)` to avoid "Cannot overwrite model" errors during hot reload.
- **Styling:** Use Tailwind utility classes. For conditional styles, use the `cn()` helper. For component variants, use CVA (see `button.tsx`).
- **State:** Client-side state goes in Zustand stores under `lib/store/`. Keep stores small and focused — one store per domain (cart, wishlist, etc.).
- **Pages in `(home)/`:** These inherit the shared layout with header and footer. Pages outside this group (like `/signin`) get the bare root layout.

---

## Deployment

Build and deploy to any Node.js hosting platform:

```bash
npm run build
npm run start
```

For **Vercel** deployment, push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). Set the environment variables in the Vercel dashboard.

Make sure to:
1. Set all `.env.local` variables in your hosting provider's environment settings
2. Switch Stripe keys from test (`sk_test_`) to live (`sk_live_`) for production
3. Set up a Stripe webhook endpoint pointing to `https://yourdomain.com/api/webhooks/stripe` with the `checkout.session.completed` event
