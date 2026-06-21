# DevEvent — The Hub for Every DevEvent You Mustn't Miss

DevEvent is a full-stack event discovery and management platform built with **Next.js 16 (App Router)**, **MongoDB**, **Tailwind CSS v4**, and **PostHog** analytics. It lets organizers create developer-focused events (hackathons, meetups, conferences, workshops) and lets attendees browse, explore, and book their spots — all in one place.

---

## Tech Stack

| Layer          | Technology                                            |
|----------------|--------------------------------------------------------|
| Framework      | [Next.js 16.2](https://nextjs.org) (App Router, React 19.2) |
| Language       | TypeScript                                             |
| Database       | MongoDB via Mongoose 9.7                                |
| Image Hosting  | Cloudinary                                             |
| Styling        | Tailwind CSS v4                                        |
| Analytics      | PostHog (client-side events + reverse proxy)            |
| Icons          | Lucide React                                           |
| Linting        | ESLint + `eslint-config-next`                          |

---

## Architecture

DevEvent follows the **Next.js App Router** convention. The project is a monorepo-lite with a single application:

- **Server Components** fetch data server-side and render HTML directly.
- **Client Components** (marked with `'use client'`) handle interactivity — booking forms, navigation toggles, analytics events.
- **API Route Handlers** (`app/api/`) provide a RESTful backend consumed by both server and client components.
- **Mongoose models** in `database/` define the MongoDB schema with pre-save hooks for slug generation and data normalisation.
- **PostHog** is initialised in a client provider and routes events through a Next.js rewrite (`/ingest/*`) to bypass ad blockers.

```
Browser
  │
  ├── Server Components (app/page.tsx, app/events/*)
  │     └── fetch() → API Route Handler → MongoDB
  │
  └── Client Components (Navbar, EventCard, EventDetailClient, CreateEventPage)
        └── posthog-js → /ingest/* → PostHog Cloud
```

---

## Project Structure

```
event-management/
├── app/
│   ├── api/
│   │   └── events/
│   │       ├── route.ts                  # GET (list) / POST (create) events
│   │       └── [slug]/
│   │           ├── route.ts              # GET single event by slug
│   │           └── book/route.ts         # POST booking for an event
│   ├── create/
│   │   └── page.tsx                      # Event creation form (client)
│   ├── events/
│   │   ├── page.tsx                      # All events listing (server)
│   │   └── [slug]/
│   │       ├── page.tsx                  # Event detail page (server → client)
│   │       └── EventDetailClient.tsx     # Event detail + booking UI (client)
│   ├── globals.css                       # Tailwind v4 imports + base styles
│   ├── layout.tsx                        # Root layout (Navbar, PostHog provider)
│   ├── page.tsx                          # Home page (featured events)
│   └── favicon.ico
├── components/
│   ├── EventCard.tsx                     # Event card with analytics tracking
│   ├── ExploreBtn.tsx                    # "Explore Events" CTA button
│   ├── Navbar.tsx                        # Responsive navigation bar
│   └── PostHogProvider.tsx               # PostHog client init + pageview tracking
├── database/
│   ├── index.ts                          # Barrel export for models
│   ├── event.model.ts                    # Event schema + slug/time normalisation
│   └── booking.model.ts                  # Booking schema + referential integrity
├── lib/
│   ├── constants.ts                      # Static event data (seeds)
│   └── mongodb.ts                        # Cached MongoDB connection helper
├── public/
│   ├── flow2.png
│   ├── logo.png
│   └── images/                           # Static event images
├── .env.local                            # Environment variables (see below)
├── AGENTS.md                             # Next.js version advisory
├── CLAUDE.md
├── eslint.config.mjs                     # ESLint flat config
├── instrumentation-client.ts             # PostHog instrumentation entry point
├── next.config.ts                        # Next.js config (images, rewrites)
├── package.json
├── postcss.config.mjs                    # PostCSS with @tailwindcss/postcss
├── posthog-setup-report.md               # PostHog integration report
├── tsconfig.json
└── README.md
```

---

## Features

### Browse Events
- **Home page** — shows featured events fetched from the API with dynamic `EventCard` components.
- **All Events page** (`/events`) — lists every event with the same card layout; shows an empty state when no events exist.

### Event Details
- **Detail page** (`/events/[slug]`) — a server component calls `GET /api/events/[slug]` and renders a rich client component that displays:
  - Title, description, overview, image
  - Venue, location, date, time, mode (In-Person / Online / Hybrid)
  - Target audience, organizer, tags
  - Agenda items

### Booking
- Each event detail page includes a **booking card** with an email input form.
- Submitting the form sends a `POST` to `/api/events/[slug]/book`, which validates the email and creates a booking document in MongoDB.
- Referential integrity is enforced: the booking pre-save hook verifies the event exists.

### Create Events
- **Create page** (`/create`) — a full client-side form that submits event data as `multipart/form-data` (including an image upload) to `POST /api/events`.
- The API route uploads the image to **Cloudinary**, stores the returned URL, and creates the event document.
- Form includes dynamic agenda items (add/remove rows), comma-separated tags, and validation.

### Analytics (PostHog)
- **Auto-captured** — page views are sent via `posthog-js` on every route change.
- **Custom events:**
  | Event                  | Trigger                          | Properties                                    |
  |------------------------|----------------------------------|-----------------------------------------------|
  | `explore_events_clicked` | "Explore Events" button click    | —                                             |
  | `event_card_clicked`     | Event card click                 | `event_title`, `event_slug`, `event_location`, `event_date` |
- PostHog is proxied through `/ingest/*` rewrites to avoid ad-blocker blocking.

---

## Getting Started

### Prerequisites

- Node.js >= 20
- A **MongoDB** instance (local or Atlas)
- A **Cloudinary** account (for image uploads)
- A **PostHog** project (optional — analytics degrade gracefully)

### Environment Variables

Create a `.env.local` file in the project root with the following:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?appName=<app>
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_<your_token>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## API Reference

All API routes are under `app/api/`.

### `GET /api/events`

Returns all events sorted by creation date (newest first).

**Response `200`**
```json
{
  "events": [
    {
      "_id": "...",
      "title": "DevFest Accra 2026",
      "slug": "devfest-accra-2026",
      "description": "...",
      "overview": "...",
      "image": "https://res.cloudinary.com/...",
      "venue": "Accra International Conference Centre",
      "location": "Accra",
      "date": "2026-07-15",
      "time": "9:00 AM - 5:00 PM",
      "mode": "In-Person",
      "audience": "Developers",
      "agenda": ["Registration", "Keynote", "...
"},
      "organizer": "GDG Accra",
      "tags": ["conference", "web"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### `POST /api/events`

Creates a new event. Accepts `multipart/form-data`.

**Form fields:**
| Field         | Type     | Required | Description                    |
|---------------|----------|----------|--------------------------------|
| `title`       | string   | yes      | Event title                    |
| `description` | string   | yes      | Short description              |
| `overview`    | string   | yes      | Detailed overview              |
| `venue`       | string   | yes      | Venue name                     |
| `location`    | string   | yes      | City / area                    |
| `date`        | string   | yes      | YYYY-MM-DD (or any parseable)  |
| `time`        | string   | yes      | e.g. 10:00 AM                  |
| `mode`        | string   | yes      | In-Person / Online / Hybrid    |
| `audience`    | string   | yes      | Target audience                |
| `organizer`   | string   | yes      | Organizer name                 |
| `image`       | file     | yes      | Event image (uploaded to Cloudinary) |
| `agenda`      | JSON string | yes   | Array of agenda items          |
| `tags`        | JSON string | no    | Array of tags                  |

**Response `201`**
```json
{
  "message": "Event Created Successfully",
  "event": { ... }
}
```

### `GET /api/events/[slug]`

Returns a single event by its URL slug.

**Response `200`** — same shape as the event object above.  
**Response `404`** — `{ "message": "Event not found" }`

### `POST /api/events/[slug]/book`

Books a spot at an event.

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response `201`**
```json
{
  "message": "Booked",
  "bookingId": "..."
}
```

**Response `400`** — invalid or missing email.  
**Response `404`** — event slug not found.  
**Response `500`** — server/database error.

---

## Database Models

### Event (`database/event.model.ts`)

| Field       | Type       | Required | Notes                                         |
|-------------|------------|----------|-----------------------------------------------|
| `title`     | String     | yes      |                                                |
| `slug`      | String     | auto     | Generated from title; unique, indexed          |
| `description` | String   | yes      |                                                |
| `overview`  | String     | yes      |                                                |
| `image`     | String     | yes      | Cloudinary URL                                 |
| `venue`     | String     | yes      |                                                |
| `location`  | String     | yes      |                                                |
| `date`      | String     | yes      | Normalised to `YYYY-MM-DD` on save             |
| `time`      | String     | yes      | Normalised to `HH:MM AM/PM` on save            |
| `mode`      | String     | yes      | In-Person / Online / Hybrid                    |
| `audience`  | String     | yes      |                                                |
| `agenda`    | [String]   | yes      | At least one item required                     |
| `organizer` | String     | yes      |                                                |
| `tags`      | [String]   | no       |                                                |
| `createdAt` | Date       | auto     | Via Mongoose `timestamps`                      |
| `updatedAt` | Date       | auto     | Via Mongoose `timestamps`                      |

**Pre-save hooks:**
- **Slug generation** — converts `title` to a URL-safe slug (lowercased, whitespace → hyphens, non-alphanumeric stripped). Only regenerated when `title` is modified.
- **Date normalisation** — any parseable date string is converted to `YYYY-MM-DD`.
- **Time normalisation** — 24-hour format is converted to `HH:MM AM/PM`.

### Booking (`database/booking.model.ts`)

| Field       | Type                | Required | Notes                                |
|-------------|---------------------|----------|--------------------------------------|
| `eventId`   | ObjectId (ref Event)| yes      | Indexed                              |
| `email`     | String              | yes      | Lowercased, validated via regex      |
| `createdAt` | Date                | auto     | Via Mongoose `timestamps`            |
| `updatedAt` | Date                | auto     | Via Mongoose `timestamps`            |

**Pre-save hooks:**
- **Referential integrity** — verifies the referenced `Event` document exists before saving.

---

## Key Components

| Component                    | Type     | File                          | Description                                         |
|------------------------------|----------|-------------------------------|-----------------------------------------------------|
| `Navbar`                     | Client   | `components/Navbar.tsx`       | Sticky nav with responsive hamburger menu            |
| `EventCard`                  | Client   | `components/EventCard.tsx`    | Card showing event thumbnail, title, date, location; captures `event_card_clicked` analytics |
| `ExploreBtn`                 | Client   | `components/ExploreBtn.tsx`   | CTA button that captures `explore_events_clicked`   |
| `PostHogProvider`            | Client   | `components/PostHogProvider.tsx` | Initialises PostHog, wraps children, auto-captures page views |
| `EventDetailClient`          | Client   | `app/events/[slug]/EventDetailClient.tsx` | Full event details + booking form (email input) |

---

## Configuration Highlights

### Next.js Config (`next.config.ts`)

- **Image remote patterns** — allows Cloudinary-hosted images via `res.cloudinary.com`.
- **Rewrites** — proxies PostHog `/ingest/*` requests to `us.i.posthog.com` and `us-assets.i.posthog.com` (ad-blocker circumvention).
- **`skipTrailingSlashRedirect`** — enabled to support PostHog API trailing slash behaviour.

### Tailwind CSS v4 (`postcss.config.mjs`)

Uses the `@tailwindcss/postcss` plugin. Base styles in `globals.css` import Tailwind via `@import 'tailwindcss'` and define global typography and colour tokens.

### TypeScript (`tsconfig.json`)

- Strict mode enabled.
- Path alias `@/*` mapped to project root.
- Bundler module resolution with React JSX transform.

### ESLint (`eslint.config.mjs`)

Flat config using `eslint-config-next` with core-web-vitals and TypeScript rulesets.

---

## Deployment

The project is ready to deploy on **Vercel**:

1. Push the repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Add the environment variables from `.env.local` (production values for MongoDB, Cloudinary, PostHog).
4. Deploy.

> **Note:** Ensure `NEXT_PUBLIC_BASE_URL` points to your production domain (e.g. `https://devevents.vercel.app`).

---

## Analytics Dashboards

PostHog dashboards were set up during the integration wizard:

- [Analytics Basics Dashboard](https://us.posthog.com/project/425730/dashboard/1717379)
- [Explore Events Clicked (30d)](https://us.posthog.com/project/425730/insights/ByPbqD8C)
- [Event Card Clicks (30d)](https://us.posthog.com/project/425730/insights/G4nfJuzM)
- [Unique Users Exploring Events (30d)](https://us.posthog.com/project/425730/insights/DMf7VPV4)

---

## License

Private project — all rights reserved.