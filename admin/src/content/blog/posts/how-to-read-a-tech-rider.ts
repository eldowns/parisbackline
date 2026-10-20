import type { Post } from "../types";

const post: Post = {
  slug: "how-to-read-a-tech-rider",
  title: "How to Read a Tech Rider and Turn It Into a Backline Order",
  seoTitle: "How to Read a Tech Rider (and Order Backline From It)",
  description: "A section-by-section guide to reading an artist's technical rider — input lists, stage plots, monitor and wireless requirements — and turning it into a clear, complete backline rental order.",
  category: "Guides",
  published: "2026-10-19",
  keywords: ["tech rider", "technical rider", "how to read a rider", "input list", "stage plot", "backline rider"],
  related: ["how-to-build-a-great-tech-rider", "what-is-backline", "production-advance-checklist"],
  body: `
A technical rider is the act's instruction manual for their show. It tells the venue, the audio vendor and the backline company what the performers need to sound like themselves. Riders range from a single page to thirty, and they are written by people in a hurry. Here's how to read one efficiently and turn it into an order nobody has to revise on show day.

## Start with the contact page

Before anything else, find the **production manager or tour manager** and the **FOH engineer**. Riders are often outdated; the people are not. A two-minute call with the engineer will tell you which pages still apply and which items are "nice to have." Write down:

- Who approves substitutions
- Who is carrying what (some acts bring their own console, mics or in-ears)
- Whether the rider is the full-production version or a reduced "fly date" version

Many artists keep two riders. The fly-date or "soft ticket" rider is shorter and assumes the act is carrying almost nothing.

## The input list

The input list (sometimes "channel list") is the heart of the audio rider. Each line is one channel: what it is, which microphone or DI it uses, and whether it needs a stand.

| Ch | Source | Mic / DI | Stand | Notes |
| --- | --- | --- | --- | --- |
| 1 | Kick in | Beta 91A | — | |
| 9 | Keys L | DI | — | Stereo pair |
| 10 | Keys R | DI | — | |
| 21 | Lead vox | Wireless (act) | Round base | |
| 22 | Spare vox | Wireless | — | Spare on stage |

What it tells you for backline:

- **Channel count** decides the console and stage box. A 40-input show fits an [M32R](/catalog/midas-m32r) with a [DL32](/catalog/midas-dl32); larger lists may call for a [dLive](/catalog/allen-heath-dlive-cdm48) system.
- **Wireless lines** tell you how many handheld and bodypack channels to plan, and whether the act is carrying them.
- **DI lines** tell you how many DI boxes keys, playback and bass will need. Stereo sources need two.

## The stage plot

The stage plot is a drawing of the stage seen from above. It shows where each musician stands, where the instruments go, and where power, monitors and risers are needed. Read it alongside the input list:

- Count **instrument positions**, and check whether each needs power
- Note **riser sizes** — drum and keys risers are often specified
- Look for **monitor positions**: wedges, side-fills, drum fill or "IEM" labels
- Check **stage left and stage right** labels; they're from the performer's point of view, facing the audience

## The backline page

Here the act lists instruments by make and model. Read carefully for three things.

### Exact models and acceptable alternates

"Nord Stage 3 88 (or Stage 4)" is clear. "Nord" alone is not — ask. Keyboards, amps and drums are personal; a player who has built their sounds on one instrument may not accept a substitute. If a model is "or equivalent," confirm what the artist considers equivalent before booking.

### Accessories

Riders forget accessories more often than instruments. For every item, ask what makes it playable:

- Keyboards: stand type, sustain and expression pedals, bench, music stand
- Amps: speaker cabinet, power, any footswitches
- Wireless: spare batteries, antennas, any instrument cables
- In-ears: earphones (usually the act's own molds), bodypacks, spares

### Who provides what

Look for phrases like "artist provides" or "purchaser to provide." Anything marked as the purchaser's responsibility is what you need to source.

## Monitor and in-ear requirements

The monitor section tells you how the performers hear themselves. Count:

- **IEM mixes**, stereo or mono, and whether the act carries its own transmitters
- **Wedge mixes** and how many wedges per mix
- **Talkback and cue** needs for the musical director

If the act needs in-ear systems, plan [IEM transmitters and packs](/catalog/sennheiser-ew-iem-g4) plus a spare pack, and add the IEM frequencies to the show's wireless plan. Our guide to [setting up Sennheiser EW IEM G4](/blog/in-ear-monitor-setup-sennheiser-ew-iem-g4) covers the details.

## Wireless requirements

The wireless page lists handhelds, bodypacks and IEMs, often with preferred models and capsules. Total every RF device on the show — not just the headliner's — and send that count to whoever coordinates frequencies. In Los Angeles, a high channel count is the norm, not the exception; see [wireless frequency coordination in Los Angeles](/blog/wireless-frequency-coordination-los-angeles).

## Power and hospitality notes that affect gear

Two non-audio sections still matter:

- **Power**: dedicated circuits at instrument positions, and whether the act travels with non-US gear that needs step-down transformers
- **Schedule**: load-in, soundcheck and changeover times decide when gear has to be on site and how long it stays

## Turning the rider into an order

Once you've read it all, rewrite the requirements as a single list:

1. Every item by make and model, with quantity
2. Accessories under each item
3. Spares (wireless channels, IEM packs, batteries, cables)
4. Delivery address, load-in window and dock details
5. Show times and load-out window
6. On-site contact with phone number

Send that list — and the rider itself — to your backline provider. A good provider will read the rider too and flag anything missing.

## Common rider pitfalls

- **Old riders.** Always confirm the version date with the production manager.
- **"House" assumptions.** A rider may assume a house console or mics that your venue doesn't have.
- **Unspecified pedals and stands.** These cause more show-day scrambling than any instrument.
- **Uncounted wireless.** Openers, hosts and presenters all add RF channels.

For a broader pre-show checklist, read [the production advance](/blog/production-advance-checklist).

Writing your own rider instead? Read [how to build a great tech rider](/blog/how-to-build-a-great-tech-rider), or put a backline list together with our free [Rider Builder](/rider-builder).

Have a rider in hand? [Send it to us](/#inquire). We'll read it with you, build the backline order from our [catalog](/catalog), and help source anything we don't stock.
`,
};

export default post;
