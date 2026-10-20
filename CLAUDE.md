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
- `src/lib/split.ts` — Current payout structure (payoutVersion 2), pure + unit tested (`npm test`)
- `src/lib/revenue.ts` — Old 50/50 split, kept only for bookings before Jutes (payoutVersion 1)
- `src/lib/booking-payout.ts` — Picks v1/v2 for a saved booking; shared by form, booking page, earnings
- `src/lib/invoice-totals.ts` — Client-facing invoice lines/totals (email, PDF, preview)
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

## Payout Structure (v2, internal only — clients just see the invoice total)
Calculated on the rental only; delivery is outside the waterfall.
1. Rental subtotal = gear + custom items + sub-rentals (we enter our cost; client is billed cost + 15%)
2. Discount is capped so rental never drops below the $100 minimum; under $100 adds a "Minimum order adjustment" line
3. Gross = rental total − sub-rental costs (providers get their cost; only the markup is split)
4. Owner's Fee = 15% of gross, split 50/50 Eric/Marko
5. Referral = 10% of (gross − Owner's Fee), outside referrers only (not Eric/Marko)
6. Remainder is sliced by gear revenue. Our own gear (Eric/Marko, custom items, sub-rental markup):
   Admin 25%, Gear 75%. Gear partners (e.g. Dario): 50% partner / 50% Admin.
7. Admin is one pie: Eric, Marko or Both. Gear with no owner goes to Eric/Marko 50/50
8. Delivery = $50 drop-off + $50 pick-up, each paid to whoever did it; a leg the client handles is left off
Rounding: integer cents; Owner's Fee and "Both" admin kept even; spare cents go to Gear (largest owner).

## Date Handling
- Dates stored at noon UTC (T12:00:00Z) to prevent timezone shift
- Display uses UTC parsing to avoid off-by-one day errors

## Build Notes
- `typescript.ignoreBuildErrors: true` in next.config.ts (Vercel Hobby plan)
- `postinstall` script runs `prisma generate`
- Supabase password has `!!` — URL-encode as `%21%21` in connection strings
