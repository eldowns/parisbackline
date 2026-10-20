import type { Post } from "../types";

const post: Post = {
  slug: "how-to-build-a-great-tech-rider",
  title: "How to Build a Great Tech Rider (That Crews Actually Read)",
  seoTitle: "How to Build a Great Tech Rider: A Practical Guide",
  description: "A step-by-step guide for artists and production managers to writing a technical rider that venues and backline companies can act on: structure, input lists, stage plots, backline specs and the tools that make it easier.",
  category: "Guides",
  published: "2026-10-19",
  keywords: ["how to write a tech rider", "tech rider template", "backline rider", "stage plot software", "StageBuilder Pro", "input list template"],
  related: ["how-to-read-a-tech-rider", "production-advance-checklist", "what-is-backline"],
  body: `
A tech rider is the document that tells every venue and vendor how to make your show happen. A good one gets you the right gear, a smooth load-in and a soundcheck that starts on time. A vague or bloated one gets skimmed, guessed at and "interpreted" on show day. Here's how to write a rider that crews can actually use.

## Who reads your rider — and what they need

Your rider goes to several people, and each one is looking for something specific:

- **The venue's production manager** wants to know what the house has to provide and whether the show fits the room.
- **The house audio engineer** wants your input list, monitor needs and console preference.
- **The backline company** wants exact makes and models, accessories and quantities.
- **The promoter** wants to know what it will cost.

Write so each of them can find their section in seconds. That means clear headings, one topic per page and no important details buried in paragraphs.

## The structure that works

Most professional riders follow the same order. Stick to it — crews know where to look.

1. **Cover and contacts.** Artist name, rider date or version, and the production and tour managers with mobile numbers and emails.
2. **General notes.** Crew size, what you travel with, and what you need provided — in a few bullet points.
3. **Stage plot.** An overhead drawing of every position, monitor and power drop.
4. **Input list.** Every channel, source, mic or DI, and stand.
5. **Monitors.** Wedge and in-ear mixes, stereo or mono, and the number of packs.
6. **Wireless.** Every RF channel you bring or need.
7. **Backline.** Instruments and accessories by make and model.
8. **Power and staging.** Circuits at each position, risers and stage dimensions.
9. **Lighting and video**, if you have specific needs.

Keep hospitality in a separate document. It's read by different people, and mixing the two buries your technical needs.

## Make the stage plot do the work

A stage plot is the fastest way to communicate your show, and the most commonly neglected page. A good plot shows:

- Every musician's position, labeled by name or role
- Instruments, amps and keyboard rigs at each position
- Monitor wedges, side-fills and drum fills — or "IEM" where performers use in-ears
- Power drops at each position
- Risers with sizes
- Where the input list's channel numbers live on stage

Hand-drawn plots and old screenshots cause confusion. Dedicated stage plot software produces a cleaner, more consistent result. One good option is [StageBuilder Pro](https://stagebuilderpro.com), a free, browser-based stage plot builder. You place audio, backline, lighting and staging gear on a stage in 2D or 3D, and it generates your input and output lists from the plot. It then exports a PDF rider that combines the plan, a 3D view and the I/O lists. Its free tier includes one saved plot, PDF export and read-only share links that anyone can open without an account. Paid plans add unlimited saves, an AI build assistant and live collaboration.

Whatever tool you use, the rule is the same: the plot and the input list must agree. If channel 14 is the acoustic guitar on the input list, it should be on the acoustic guitar position on the plot.

## Write an input list engineers can patch from

The input list should be a table, not a paragraph. Include:

| Column | Example |
| --- | --- |
| Channel | 14 |
| Source | Acoustic guitar |
| Mic / DI | Active DI |
| Stand | — |
| Notes | Phantom power on |

Group channels in the order engineers expect — drums, bass, guitars, keys, playback, vocals, then effects returns. List stereo sources as two channels. Our [DI box guide](/blog/di-boxes-explained) explains which sources need active or passive DIs.

## Spec backline precisely

The backline page is where vague riders cost money. For every item:

- **Name the make and model.** "Nord Stage 3 88," not "keyboard."
- **List acceptable alternates** — or say "no substitutes" when you mean it, and only then.
- **List accessories** under each item: stands, pedals, benches, cables, DI boxes.
- **State quantities and spares**, especially for wireless and in-ear packs.
- **Say what you carry.** If you bring your own pedalboards and in-ear molds, say so.

If you need a quick way to put a clean backline list together, try our free [Backline Rider Builder](/rider-builder). Add your artist and contact details, add items one at a time and download a formatted PDF you can attach to your rider or send to a backline company.

## Be honest about what's essential

Riders that ask for everything get negotiated down. Riders that separate **requirements** from **preferences** get respected. Mark items as:

- **Required** — the show can't happen without it
- **Preferred** — what you'd like, with the alternates you'll accept

That honesty also helps promoters budget and gives backline companies room to offer a good alternative when an exact model isn't available.

## Keep it current

- **Version and date every rider** on the cover page.
- **Update it after lineup changes**, new gear or a new in-ear setup.
- **Keep a fly-date version**: a shorter rider that assumes you're carrying almost nothing. See [fly dates in Los Angeles](/blog/fly-dates-backline-los-angeles).
- **Send it as a PDF**, and name the file with the artist, the word "rider" and the date.

## Make it easy to read

- One topic per page, with large clear headings
- Tables for lists, not paragraphs
- No more than a page or two of general notes
- A contact on every page footer
- Readable on a phone — crews often read riders in a loading dock

## A final check before you send

1. Do the stage plot and input list match?
2. Is every backline item named by make and model, with accessories?
3. Are wireless and in-ear counts complete, with spares?
4. Are contacts current?
5. Is the rider dated and versioned?

A rider that passes those five checks will get you a better show almost anywhere. To see the rider from the other side of the table, read [how to read a tech rider](/blog/how-to-read-a-tech-rider), and use the [production advance checklist](/blog/production-advance-checklist) to confirm everything before show day.

Playing Los Angeles? Build your list with the [Rider Builder](/rider-builder), then [send it to us](/#inquire). We'll match it against our [catalog](/catalog) and help source anything we don't stock.
`,
};

export default post;
