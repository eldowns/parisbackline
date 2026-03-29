# Paris Backline

## Project Structure
- `/` — Static landing page files (legacy, served by Vercel from `admin/`)
- `/admin` — Next.js 16 app (root directory for Vercel deployment)
  - Public landing page at `/`
  - Admin portal behind `/dashboard`, `/bookings`, `/equipment`, `/clients`, `/calendar`, `/earnings`
  - Login at `/login`

## Stack
- **Framework**: Next.js 16 (Turbopack dev, Webpack prod)
- **Database**: Supabase Postgres via Prisma ORM
- **Auth**: JWT (jose) with httpOnly cookies
- **Email**: Resend (from accounting@parisbackline.com, reply-to parisbackline@gmail.com)
- **PDF**: @react-pdf/renderer (Helvetica font, no remote fonts)
- **Styling**: Tailwind CSS v4, Bebas Neue + Inter fonts via Bunny Fonts
- **Deploy**: Vercel (root directory: `admin`, framework: Next.js)

## Key Files
- `prisma/schema.prisma` — Database models
- `src/lib/revenue.ts` — Partnership revenue split calculator (50/50 gear/admin per agreement)
- `src/lib/invoice-pdf.tsx` — PDF invoice template
- `src/lib/auth.ts` — JWT session management
- `src/lib/prisma.ts` — Prisma client singleton

## Design System
- Dark theme (#09090f background)
- Gold accent (#c8a44a) matching the public site
- Square corners (borderRadius: 1px) everywhere
- Bebas Neue for headings, Inter for body
- Sidebar-bg class for transparent sidebar with blur

## Users
- eric / ElonBad69! (greeting: "Eric")
- marko / ElonBad69! (greeting: "Fat Ass")

## Environment Variables (Vercel)
- DATABASE_URL — Supabase pooled connection (port 6543)
- DIRECT_URL — Supabase direct connection (port 5432)
- RESEND_API_KEY — Email sending

## Date Handling
- Dates stored at noon UTC (T12:00:00Z) to prevent timezone shift
- Display uses UTC parsing to avoid off-by-one day errors

## Build Notes
- `typescript.ignoreBuildErrors: true` in next.config.ts (Vercel Hobby plan)
- `postinstall` script runs `prisma generate`
- Supabase password has `!!` — URL-encode as `%21%21` in connection strings
