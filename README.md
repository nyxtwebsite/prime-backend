# ⚙️ Prime Vessels — Backend A-to-Z Technical Reference

> **Headless CMS & REST/GraphQL API for Prime Vessels.**  
> Built with **Payload CMS 3.x**, **Next.js 15**, and **PostgreSQL (Neon Serverless)**.

---

## 📑 Table of Contents

1. [Architecture & CMS Philosophy](#-architecture--cms-philosophy)
2. [Folder & File Directory Map](#-folder--file-directory-map)
3. [Collections (Database Schemas)](#-collections-database-schemas)
4. [Globals (Singletons & Site Controls)](#-globals-singletons--site-controls)
5. [CMS to Frontend Mapping (Developer Guide)](#-cms-to-frontend-mapping-developer-guide)
6. [Database Engine (Neon PostgreSQL) & Secrets](#-database-engine-neon-postgresql--secrets)
7. [Database Seeder (`scripts/seed.ts`)](#-database-seeder-scriptsseedts)
8. [Access Control & Security Rules](#-access-control--security-rules)
9. [REST API Endpoints](#-rest-api-endpoints)
10. [Media & Image Processing Configuration](#-media--image-processing-configuration)
11. [Local Setup, Environment Variables & Deployment](#-local-setup-environment-variables--deployment)

---

## 🏛️ Architecture & CMS Philosophy

The backend is built as a **Payload CMS 3.x** native Next.js application. It acts as the headless content engine and API server for the Prime Vessels platform.

* **True Single-Source-of-Truth**: All visual assets, texts, opening hours, banner destinations, and catalog specifications are administered through the unified `/admin` control panel.
* **Lexical Rich Text**: Modern WYSIWYG rich text editor with full support for headings, links, blockquotes, and lists.
* **Granular Role-Based Access Control (RBAC)**: Secure separation between public website visitors (who can only submit contact enquiries) and authenticated CMS administrators/editors.

---

## 🗂️ Folder & File Directory Map

```
backend/
├── src/
│   ├── collections/                         # Payload Database Collections
│   │   ├── Users.ts                         # Admin & Editor user accounts
│   │   ├── Media.ts                         # Media uploads (multi-size responsive crops)
│   │   ├── Categories.ts                    # Tableware categories with hero images & sortOrder
│   │   ├── Products.ts                      # Products with dynamic badges, stock & specs array
│   │   ├── Banners.ts                       # Multi-location promo banners with dual CTAs
│   │   └── Enquiries.ts                     # Customer contact form submissions
│   │
│   ├── globals/                             # Payload Singletons (Global Settings)
│   │   ├── SiteSettings.ts                  # Showroom hours, brand logos, delivery guarantees, SEO
│   │   ├── HomepageSettings.ts              # Section visibility toggles, hero slides, collage
│   │   └── WhatsAppSettings.ts              # Hotline number & enquiry template strings
│   │
│   ├── app/                                 # Next.js App Router for Payload
│   │   ├── (payload)/admin/[[...segments]]/ # Payload Admin Panel UI
│   │   └── (payload)/api/[...slug]/         # Automated REST API endpoints
│   │
│   ├── payload.config.ts                    # Master Payload Configuration
│   └── payload-types.ts                     # Auto-generated TypeScript types
│
├── scripts/
│   └── seed.ts                              # Automated Neon Database Seeder
│
├── public/media/                            # Local static upload directory (sample media assets)
├── .env                                     # Environment configuration (credentials & ports)
├── .env.example                             # Environment template
└── package.json
```

---

## 🗄️ Collections (Database Schemas)

### 1. `Users` (`src/collections/Users.ts`)
- **Authentication**: JWT cookies with bcrypt password hashing.
- **Fields**: `email` (login identifier), `name`, `role` (`admin` or `editor`).

### 2. `Media` (`src/collections/Media.ts`)
- **MIME Types**: `image/*` (JPEG, PNG, WebP, SVG) and `video/*` (MP4, WebM).
- **Responsive Crop Sizes**: Automatically generates `thumbnail` (400×300), `card` (768×960), and `hero` (1920×1080) variants.
- **Storage**: Pluggable AWS S3 / Cloudflare R2 integration.

### 3. `Categories` (`src/collections/Categories.ts`)
- **Fields**: `name`, `slug`, `description`, `thumbnail` (media relation), `heroImage` (detail page banner), `featured`, `sortOrder`, `status`, and SEO meta tags.

### 4. `Products` (`src/collections/Products.ts`)
- **Fields**:
  - **Core Info**: `name`, `slug`, `category`, `description` (Rich Text), `mainImage`, `gallery`.
  - **Pricing & UI Hooks**: `price`, `offer` (Discount %), `showPrice` (Boolean toggle. When false, renders "Enquire for Price"), `badge` (Custom ribbon label like "Bestseller").
  - **Details**: `sku`, `stockStatus`, `material`, `careInstructions`.
  - **Complex Data**: `specifications` (Dynamic key-value array for materials, sizes, etc.).
  - **Overrides**: `customEnquiryMessage` (Overrides the global WhatsApp message template for this specific product).
  - **Flags & SEO**: `featured`, `status`, `metaTitle`, `metaDescription`.

### 5. `Banners` (`src/collections/Banners.ts`)
- **Fields**: `title`, `subtitle` (badge text), `description`, `image`, `mobileImage`.
- **Interactivity**: Dual Call-To-Action buttons (`ctaLabel`/`ctaLink` and `secondaryCtaLabel`/`secondaryCtaLink`).
- **Placement Control**: `displayLocation` selector (`homepage-promo`, `between-sections`, `product-pages`, `category-pages`).

### 6. `Enquiries` (`src/collections/Enquiries.ts`)
- **Fields**: `name`, `phone`, `email`, `subject`, `message`, `read` (admin tracker), `submittedAt`.
- **Purpose**: Acts as a secure internal database for lead capture submitted from the frontend contact form.

---

## ⚙️ Globals (Singletons & Site Controls)

### 1. `SiteSettings` (`src/globals/SiteSettings.ts`)
* **Identity**: `brandName`, `tagline`, `logoDark`, `logoLight`, `favicon`.
* **Contact & Location**: `address`, `contactPhone`, `contactEmail`, `showroomHours`, `sundayHours`, `instagramUrl`, `facebookUrl`.
* **Messaging & Guarantees**: `deliveryGuaranteeTitle`, `deliveryGuaranteeText`, `hospitalityCurationTitle`, `hospitalityCurationText`.
* **Site Structure**: Controls Page Headers, Footer Navigation Links, and Announcement Bar configurations.

### 2. `HomepageSettings` (`src/globals/HomepageSettings.ts`)
* **Layout Controller**: Features master visibility toggles (`showHero`, `showCategories`, `showPromoBanner`, `showFeaturedProducts`, `showSelectedCategory`, `showBrandStory`) allowing admins to construct the frontend layout without coding.
* **Hero Settings**: Configures the Hero image/video, subtitles, and CTA buttons.
* **Spotlight**: The `selectedCategory` relationship determines exactly which category to feature on the homepage.

### 3. `WhatsAppSettings` (`src/globals/WhatsAppSettings.ts`)
* **Fields**: `whatsappNumber`, `defaultMessage`, `productMessageTemplate` (supports `{productName}` injection placeholder), `floatingButtonEnabled`.

---

## 🔗 CMS to Frontend Mapping (Developer Guide)

For developers working across the stack, this section maps exactly which Payload CMS schema drives which component on the Next.js Frontend.

| CMS Collection / Global | Payload Field | Frontend Component | Location on Website |
| :--- | :--- | :--- | :--- |
| **HomepageSettings** | `show[Section]` toggles | `app/page.tsx` | Homepage Layout Blocks (Hides/Shows entire sections) |
| **HomepageSettings** | `heroMedia` | `Carousel.tsx` | Top Homepage Hero slider (Supports Video/Image) |
| **HomepageSettings** | `selectedCategory` | `SelectedCategorySection.tsx` | The "Signature Collection" spotlight block on the homepage |
| **SiteSettings** | `logoLight`, `logoDark` | `Navbar.tsx`, `Footer.tsx` | Site-wide headers and footers |
| **SiteSettings** | `address`, `showroomHours` | `InfoAndForm.tsx` | Contact Page (`/contact`) and Footer |
| **SiteSettings** | `aboutDeliverySectionDescription` | `FreeShippingSection.tsx` | About Page (`/about`) Parallax Delivery block |
| **SiteSettings** | `[Page]HeroImage` | `UpperPageTitle.tsx` | Page Header Banners across `/products`, `/categories`, `/about`, `/contact` |
| **SiteSettings** | `deliveryGuaranteeText` | `ProductDetailsTabs.tsx` | Product Detail Page -> Delivery Guarantee Tab (`/products/[slug]`) |
| **WhatsAppSettings** | `whatsappNumber` | `WhatsAppFloatButton.tsx` | Global site-wide floating action button |
| **WhatsAppSettings** | `productMessageTemplate` | `WhatsAppEnquiryButton.tsx` | Generates the pre-filled `wa.me/` URL on product pages |
| **Products** | `showPrice` | `ProductCard.tsx`, `ProductInfo.tsx` | Toggles rendering `₹ 18,500` vs `"Enquire for Price"` |
| **Products** | `badge` | `ProductCard.tsx` | Renders the red/gold custom ribbon (e.g. "Bestseller") top-left on cards |
| **Products** | `specifications` | `ProductDetailsTabs.tsx` | Renders the dynamic key-value table inside the "Specifications" tab |
| **Categories** | `heroImage` | `app/categories/[slug]/page.tsx` | The large top banner when viewing a specific category |
| **Banners** | `displayLocation` | `BannerSlider.tsx` | Filters which banners render on homepage vs category pages |
| **Enquiries** | N/A (Receives Data) | `InfoAndForm.tsx` | The `Formik` contact form submits `POST` data directly here |

---

## 🛢️ Database Engine (Neon PostgreSQL) & Secrets

The backend utilizes **Neon Serverless PostgreSQL** via the `@payloadcms/db-postgres` adapter.

**Security / Architecture Note**: In `src/payload.config.ts`, there are hardcoded fallback values for both `DATABASE_URI` (pointing to a live neon.tech database) and `PAYLOAD_SECRET`. While these ensure the app boots successfully even if `.env` is missing, they represent a potential security risk in production and should be managed via strict environment variables.

---

## ⚡ Database Seeder (`scripts/seed.ts`)

Bootstrap your entire database in seconds:
```bash
npm run seed
```
Creates admin account (`admin@primevessels.com`), uploads 18 media items, initializes globals, and seeds 5 categories, 10 products with rich specifications, and 6 promotional banners.

---

## 🔌 REST API Endpoints & Access Control

Payload automatically generates fully documented REST APIs.

* **Access Control**: Public write access is enabled strictly for `/api/enquiries` (for contact forms). All other collection writes (Create, Update, Delete) require a valid JWT cookie with `admin` or `editor` roles.
* **CORS & CSRF**: Strictly whitelisted to localhost and production domains in `payload.config.ts`.

| Endpoint | Method | Example Use Case | Access |
| :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | Fetching product catalog (`?limit=12`) | Public |
| `/api/categories` | `GET` | Rendering homepage categories | Public |
| `/api/banners` | `GET` | Fetching promotional banners | Public |
| `/api/globals/site-settings` | `GET` | Loading footer/header information | Public |
| `/api/enquiries` | `POST` | Submitting a customer lead | Public (Create Only) |

---

## 🏃 Getting Started & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Seed database
npm run seed

# 3. Start development server (Port 3001)
npm run dev

# 4. Production build
npm run build

# 5. Start production server
npm run start
```
