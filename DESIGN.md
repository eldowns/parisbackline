---
name: Paris Backline — Public Site
description: Gallery typography and live music photography for the public website (home, catalog, equipment pages, blog and rider builder).
colors:
  canvas: "#171717"
  light: "#fafaf8"
  periwinkle: "#8d9fff"
  pink: "#ff7eb6"
  line: "#42423e"
  footer-focus: "#2345ed"
  white: "#ffffff"
  error: "#ffaaa5"
  muted: "#c4c4bd"
  subtle: "#b0b0a8"
  prose: "#dcdcd5"
  pdf-accent: "#4f63d8"
typography:
  display:
    fontFamily: "PB Archivo, Arial, sans-serif"
    fontSize: "clamp(78px, 13.3vw, 240px)"
    fontWeight: 900
    lineHeight: 0.83
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "PB Archivo, Arial, sans-serif"
    fontSize: "clamp(36px, 4.5vw, 76px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "PB Archivo, Arial, sans-serif"
    fontSize: "55px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "PB Archivo, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  prose:
    fontFamily: "PB Archivo, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "PB Archivo, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  square: "0"
spacing:
  field-gap: "25px"
  section-gap: "30px"
  desktop-gutter: "4.15vw"
  mobile-gutter: "6vw"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.light}"
    rounded: "{rounded.square}"
    padding: "19px 0"
    width: "100%"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
  button-solid:
    backgroundColor: "{colors.light}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.square}"
  action:
    textColor: "{colors.periwinkle}"
    padding: "10px 0"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.light}"
    padding: "10px 16px"
  filter-selected:
    backgroundColor: "{colors.light}"
    textColor: "{colors.canvas}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.light}"
    rounded: "{rounded.square}"
    padding: "15px 0"
---

# Design System: Paris Backline — Public Site

## Overview

**Creative North Star: "Live sound as a modern-art exhibition"**

This system covers every public route inside the `(site)` route group, rooted in the shared layout's `.pb` boundary: `/`, `/catalog`, `/catalog/[slug]`, `/blog`, `/blog/[slug]` and `/rider-builder`. It started as the `/alternate` preview and replaced the homepage. `/alternate` and `/alternate/catalog` now permanently redirect to `/` and `/catalog`. The original landing page lives at `/classic` (noindex) and, like the admin portal, keeps its own gold-and-Bebas system.

The direction: overscale gallery-white type, a carbon-black canvas, periwinkle actions, open ruled sections and monochrome concert photography. Equipment discovery uses open ruled rows with white photographic product plates; long-form reading uses a calm two-column article layout. Photography is illustrative stock, not evidence of Paris Backline productions.

Source authority: `admin/src/components/site/site.css`, `Motion.tsx`, `Flywheel.tsx`, `Chrome.tsx`, `Catalog.tsx`, `Inquiry.tsx`, `PostRow.tsx`, `RiderBuilder.tsx`, `RiderPdf.tsx`, `og.tsx` and the `admin/src/app/(site)` route files. Blog content lives in `admin/src/content/blog/posts/*.ts` as Markdown strings; shared SEO constants live in `admin/src/lib/site.ts`. Direction context is in `.impeccable/alternate-brief.md`.

**Key characteristics:**
- Overscale two-line display typography.
- Carbon-black canvas, gallery-white type and periwinkle action accents.
- Sharp rules and open lists rather than decorative containers.
- Monochrome concert photography with optional scroll-driven depth, alongside nine local product WebPs.
- Small, physical micro-interactions on the hero marks (the period and the asterisk).

## Colors

### Primary
- **Periwinkle:** the masthead "Let's talk" link (a square 1px periwinkle box with periwinkle text and arrow, filling periwinkle with dark text on hover), selected text, link emphasis, display punctuation, the wordmark square, blog category labels, rider quantities and general keyboard focus. Inquiry and rider controls use a neutral treatment.
- **Footer focus:** the light footer uses a deeper cobalt focus outline for contrast.
- **PDF accent:** the exported rider PDF uses a deeper periwinkle (`#4f63d8`) so quantities stay legible on white paper.

### Neutral
- **Canvas:** the carbon-black background and selected-filter text.
- **Light:** primary text, selected-filter fill, the solid "Add item" button, inquiry focus/selection, submit rules and text, the reversed footer, and the rider preview sheet.
- **Line:** dark neutral boundaries for sections, rows, tables and the table of contents.
- **Muted / subtle / prose:** supporting copy (`#c4c4bd`), meta and labels (`#b0b0a8`), and article body text (`#dcdcd5`).
- **White:** product photography plates and text over concert photographs.

The error color is reserved for failed inquiry submission and failed PDF export. The CSS keeps historical variable names: `--paper` means the dark canvas and `--ink` means light text.

**The Periwinkle Action Rule.** Use periwinkle for action and identity emphasis. Keep form controls neutral, reading surfaces dark and the footer light.

## Typography

**Display font:** PB Archivo, with Arial and sans-serif fallbacks. The self-hosted files are `/site/archivo-black.ttf` (900) and `/site/archivo-regular.ttf` (declared 400–800). The heavy face is preloaded from the site layout. The Bunny-hosted Bebas Neue and Inter stylesheet loads only for the admin portal, `/login`, `/partner` and `/classic`, through `LegacyFonts`.

### Hierarchy
- **Display:** the two-line hero (`PARIS / BACKLINE`) and the page titles `THE CATALOG.`, `THE BLOG.` and `BUILD YOUR RIDER.` (`clamp(65px,11vw,170px)`).
- **Headline:** section headings such as service, inquiry, category sections in the blog index (`clamp(34px,4.2vw,64px)`) and "Keep reading."
- **Article title:** `clamp(44px,6.4vw,118px)`, line height (.93), max (16.5ch), balanced wrapping. Article titles keep title case; site headings stay uppercase.
- **Title:** equipment names in catalog rows (55px). The equipment detail H1 uses `clamp(64px,8.4vw,150px)`.
- **Prose:** article body at (17px)/(1.75), max (740px). The first paragraph is a (20px) lede. H2 `clamp(29px,3vw,46px)`, H3 (22px). `strong` uses the 900 face because the regular file can't synthesize bold.
- **Body and label:** as in frontmatter. Navigation is (13px).

**The Two Weights Rule.** Pair heavy headings with regular supporting copy, and keep the tight negative tracking on headings.

## Layout

The canvas has no fixed maximum width. The fluid gutter grows to (5vw) above (1700px) and becomes (6vw) at (600px) and below.

- **Home:** hero, the expanding concert photograph, the three-category catalog preview, the service statement ("If we don't have it, we'll help find it.") and the inquiry form. The former "For the live" stage-photo section has been removed.
- **Catalog:** title block, filter/search tools, ruled equipment rows. The full list is server-rendered; deep-linked `category`/`q` filters apply after hydration (read from `window.location`, no Suspense boundary).
- **Equipment detail:** breadcrumbs, a two-column hero (white 4:3 photo plate and intro), a two-column "Key features / Built for" ruled list, a "Renting in Los Angeles" statement and up to three related items using the home preview cards.
- **Blog index:** the catalog title pattern, a topic bar of in-page anchors and an article count, then one section per category with ruled `PostRow`s (meta column, title and description, diagonal arrow).
- **Article:** breadcrumbs, title, then a deck row (meta in the first column, description in the second), an optional white equipment plate (21:8), then a `1fr 3fr` body: a sticky numbered table of contents and the prose. The TOC is hidden at (900px) and below. "Keep reading" and a closing CTA follow.
- **Rider builder:** the catalog title pattern, then a `1.15fr 1fr` grid: numbered fieldsets on the left, a sticky white paper preview on the right. It collapses to one column at (900px).

At (900px) navigation and supporting columns compress, the location descriptor disappears, catalog tools stack and inquiry fields become one column. At (600px) most compositions become single-column. Inquiry fields deliberately return to two columns.

## Elevation & Depth

Surfaces are flat, with no box-shadow vocabulary. Rules, contrast and scale define hierarchy. Photo labels keep a local text shadow for legibility.

The exhibition stays in normal document flow. `--open` runs from zero to one using `(viewportHeight − sectionTop) / (viewportHeight × .85)`, narrowing the horizontal clip inset from the gutter to zero while the monochrome image translates to (-7%) and scales from (1.03) to (1.08). Hero type shifts by `min(scrollY × .12, 90px)` through `--hero-shift`. Passive scroll events schedule one animation frame at a time.

### Reveal motion

All reveal targets (`data-pb-reveal`) enter from entirely offscreen left over (1.65s) with `cubic-bezier(.22,.65,.3,1)`. At trigger time `--reveal-start` is `−(max(0, left) + width + 32)px`, so the target's right edge starts beyond the viewport's left edge. Pending targets use opacity zero only, so their layout stays measurable.

**Ordering:** when any target intersects (threshold .22, bottom root margin −14%), pending targets that share its vertical band join the same batch. The batch is grouped into rows by vertical overlap. Rows play top to bottom, and **within each row items start from the rightmost and move left**. Steps are (180ms), compressed evenly when a batch is large so the total stagger never exceeds (1080ms) and the order stays strict. The footer uses a separate observer (threshold .1, no margin) so its last lines are reachable.

**One-shot:** when an entrance animation ends, the target gets `pb-revealed`, which removes the animation permanently. Focus, hover, form state or re-renders can never replay it (this fixed the inquiry form re-animating on blur). Focusing inside a pending target, or its `.pb-home-category`, `.pb-equipment` or `.pb-post-row` group, finishes it immediately.

A server-rendered `pb-motion-enabled` root hides pending targets from first paint. A WeakSet prevents duplicate registration, and a MutationObserver registers content inserted by search or form state. Catalog registration waits for its hydration effect to dispatch `pb-content-ready` after URL filters apply. An inline 4-second watchdog removes the hiding class if motion never mounts. No-script styles and reduced-motion rules expose all content.

### Hero micro-interactions

- **The period:** the blue square after BACKLINE is an element, not a glyph, sized to (.165em) — exactly the height of the E's bottom bar, sitting on the baseline. On hover its `clip-path` morphs into a play triangle of the same height and its fill turns pink (`#ff7eb6`, `--pink`), over (.55s) `cubic-bezier(.65,0,.35,1)`. Pink appears nowhere else. A padded outer span gives it a comfortable hit area, and the clip lives on the inner span so hit testing isn't clipped.
- **The title glow:** the hero H1 and every section and page title (`data-pb-glow`: home section headings, page titles, the catalog/blog/article/rider CTAs, blog category headings and the equipment page headings) clip their background to their letterforms (`background-clip:text`, transparent text color). Prose headings, row titles and the footer are excluded. One `Glow` controller in the site layout binds every marked heading on each route. The background is the light ink plus a periwinkle radial gradient (radius (.95em), so it scales with each heading) at `--gx`/`--gy`, eased toward the pointer at 18% of the remaining distance per frame (instant under reduced motion). Entering fades the registered `--glow` property from 0 to 1 over (.5s). Colored spans inside a title, like the blue period in THE CATALOG., keep their own color. **Trail:** twenty fainter, smaller layers (radius .82→.30em, strength .50→.06) each chase the point ahead of them by 23.5% per frame, so quick moves stretch into a comet tail about four times as long and four times as slow to fade as the original six-point version. Each trail point's visibility (`--t{n}a`) scales with its distance from the head (full at 24px) and its gap to the point ahead (full at 10px), so the trail collapses invisibly at rest and bunched points never stack into a bright spot. Light only appears inside the letters, never in the gaps between them. Touch input is ignored, and forced-colors mode falls back to plain `CanvasText`.
- **The asterisk:** `Flywheel` spins up toward (1080°/s) with a (0.55s) time constant while the pointer is over it, then coasts down under friction (0.85s time constant) after the pointer leaves, stopping where it lands. The top speed stays below the rate at which its eight spokes would strobe at 60 Hz. It doesn't respond under reduced motion.

Reduced motion disables animations, transitions, smooth scrolling and image/title transforms, and shows all reveal targets immediately.

## Shapes

Rectangular image crops, square buttons and underline fields set the form language. Dividers are one pixel; key structural rules (article and rider sheet headers) are two. **The wordmark mark is a small periwinkle square** (it was a circle), built like the hero period: an inline (.165em) square, the height of the E's bottom bar, sitting on the baseline (.04em) after it. Direction arrows, including the photograph's scroll cue, are inline SVGs with a (1.6) stroke.

## Components

### Navigation and footer

The masthead is a compact stacked wordmark, `PARIS / BACKLINE` in plain type with the periwinkle square, with no underline on hover, followed by Catalog, Rider builder, Blog and the "Let's talk" inquiry link. Nav links never wrap; at (540px) and below the nav drops to its own full-width row under the wordmark, spaced edge to edge at (12px). The former Eiffel Tower letterform has been removed everywhere: masthead, hero and footer.

The light footer shows `PARIS BACKLINE`, the tagline, the copyright, a service-area line (hidden on mobile), and a link group: **Rider builder**, **Blog** and a quiet **⚜ fleur-de-lis** that links to `/login` for the admin portal, as on the original site. The fleur-de-lis is an inline SVG (18px, 55% opacity, full on hover), so it renders the same on every platform and never as a color emoji.

### Buttons and action links

The submit button is full-width and transparent, with light text, a dark top rule and a light bottom rule. Hover mutes the text and rules over (200ms). Disabled states reduce opacity (Sending… uses (.65) and a waiting cursor; an incomplete rider export uses (.45) and a not-allowed cursor). Text action links use a bottom rule and a separated arrow; diagonal arrows move (3px, −3px) on hover. The rider builder's "Add item" is the one solid button: light fill, dark text, turning periwinkle on hover.

Interactive elements get a periwinkle (2px) focus-visible outline with a (6px) offset. Inquiry and rider fields use an underline-only focus treatment. The footer uses cobalt.

### Inputs

Fields have transparent backgrounds, square corners and a neutral bottom border. Selects match: no native chrome, an inline chevron and the same underline. Labels stay visible. The inquiry form prefills its message from the `equipment` query parameter.

### Catalog, filters and equipment

Category filters are square buttons with `aria-pressed`. Search updates the list on every keystroke and mirrors `category` and `q` into the URL with history replacement. Rows are open three-column compositions. Each name links to its equipment page, and the photo plate duplicates that link without being a separate tab stop. Equipment data, including each page's overview, features and uses, lives in `components/site/equipment.ts`.

### Blog

`PostRow` is the shared ruled row for the index, "Keep reading" and related lists. Article prose supports headings with stable anchor IDs, lists with periwinkle markers, ruled tables (`.pb-table`, horizontally scrollable), blockquotes with a periwinkle rule, and underlined periwinkle links. External links open in a new tab.

### Rider builder

Four numbered fieldsets: (01) artist and contact, (02) optional show details, (03) backline, (04) optional notes. Backline items are added one at a time (make and model with catalog suggestions, quantity, notes), with quick-add chips for house inventory. There is no category field; the list order is the rider order. Each item can be moved up or down or removed, and the preview and PDF follow that order exactly. Export stays disabled until the artist, contact name, a phone or email, and at least one item are present, and a live note lists what's missing. The draft persists to `localStorage` as a convenience only.

The preview is a white paper sheet that mirrors the PDF: artist and "BACKLINE RIDER" header, show line, contact strip, a single "Backline" table (quantity, item, notes, with a total piece count) and notes. The PDF (`RiderPdf.tsx`, `@react-pdf/renderer`, Helvetica, US Letter) is generated in the browser on demand through a dynamic import, with a fixed footer and page numbers.

### Social cards and icons

`og.tsx` renders the 1200×630 social card (carbon canvas, heavy white title, periwinkle accents, Archivo) for the site default (`/opengraph-image`) and each article (`/blog/[slug]/social.png`). The favicon and Apple icon are a white heavy "P" with the periwinkle mark on carbon.

## Do's and Don'ts

### Do:
- **Do** keep this system inside the `(site)` routes and `.pb` boundary. Admin and `/classic` keep their own systems.
- **Do** use heavy Archivo headings with regular supporting text.
- **Do** keep keyboard focus, semantic labels and visible form, filter and export feedback.
- **Do** keep form controls transparent and neutral, with underline-based focus.
- **Do** keep the reduced-motion and first-paint visibility fallbacks.
- **Do** reveal content from offscreen left, row by row, rightmost first, exactly once.
- **Do** treat stock concert photography as illustrative imagery.
- **Do** keep equipment and article claims to verified specifications.

### Don't:
- **Don't** add decorative cards or surface shadows. Product plates and the rider sheet are deliberate white "paper" surfaces, not cards.
- **Don't** invent inventory availability, prices, testimonials or production credits.
- **Don't** reintroduce the Eiffel Tower letterform or the round wordmark dot.
