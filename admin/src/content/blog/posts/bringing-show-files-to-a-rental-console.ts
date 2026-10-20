import type { Post } from "../types";

const post: Post = {
  slug: "bringing-show-files-to-a-rental-console",
  title: "Bringing Your Show File to a Rental Console",
  description: "How touring and guest engineers move scenes and show files onto rental Midas M32 and Allen & Heath dLive consoles — firmware, routing, patching, I/O differences and a pre-show checklist.",
  category: "Mixing",
  published: "2026-10-19",
  keywords: ["console show file", "M32 scene file", "dLive show file", "rental console", "load show file", "FOH engineer fly date"],
  related: ["midas-m32r-vs-m32c-dl32", "allen-heath-dlive-c1500-cdm48", "fly-dates-backline-los-angeles"],
  body: `
For a touring or guest engineer, the show file is everything: hundreds of decisions about EQ, dynamics, routing and effects built over months. Loading it on a rental console should take minutes. Done carelessly, it can eat the whole soundcheck. Here's how to make it painless.

## Match the platform

A show file only loads on the console family it was built for.

- **Midas M32** scenes load across the M32 family — the [M32R](/catalog/midas-m32r), [M32C](/catalog/midas-m32c) and full-size M32. The M32 and Behringer X32 platforms are closely related, and many engineers move scenes between them, but always test before show day.
- **Allen & Heath dLive** show files load on any dLive system, including the C Class [C1500](/catalog/allen-heath-dlive-c1500) with a [CDM48](/catalog/allen-heath-dlive-cdm48). dLive and Avantis are separate platforms.

If the console on your rider isn't available, ask early. Your engineer may be able to rebuild the show on another platform in offline software, but that takes time.

## Check firmware

Firmware is the most common reason a show file won't load.

- Tell your rental company the **firmware version** your show was built on.
- A file built on a **newer** version often won't open on older firmware.
- Opening an older show on newer firmware usually works, but check the release notes for any processing changes.
- Don't update firmware on a rental console yourself without asking — it may affect the next user, and on networked systems every component has to match.

## Bring the file in more than one way

- On a **USB stick** formatted the way the console expects (FAT32 is the safe choice)
- In **cloud storage** you can reach from your phone
- As an **offline editor** file on your laptop (M32-Edit or dLive Director)

Name the files clearly with the date and the venue. "Show_FINAL_v7_real" helps no one at 4 p.m.

## Know what changes when the hardware changes

Your show file remembers your processing — but it can't know what's physically plugged in at this venue.

### Inputs and stage boxes

If you built the show around one stage box and the rental has two, or uses local preamps, the **routing** may need changes. Check that each channel's source matches what's actually connected. On the M32, that means the input routing blocks for local, AES50 A and AES50 B. On dLive, check the input patch to the MixRack sockets and any expanders.

### Outputs

Mains, subs, fills, wedges and IEM sends must be **patched to physical outputs** on this system. Mismatched output routing is the classic cause of "everything's fine except the in-ears are silent."

### Preamp gains

Gain settings saved in your show will be applied to whatever preamps are patched — or skipped, if your show uses safes or recall filters. Verify gains on every input during line check.

### Shared stage boxes

If FOH and monitors share preamps, agree which console controls gain before anyone loads a show. The other console uses digital trim.

## Use recall safes and scopes

Both platforms let you protect certain settings when you recall a scene:

- Keep **routing and patching** safe if the house system is already patched and working
- Keep **preamp gain** safe if another engineer controls it
- Recall only **processing and mix settings** when you just need your sound

Using safes means the house engineer's working patch doesn't disappear when you load your show.

## Virtual soundcheck saves time

If you recorded a multitrack on a previous show, bring it. Playing it back through the rental console lets you check routing, gain structure and processing before the band arrives. On the M32 platform, multitrack audio over USB through the expansion card is common. Confirm the console's card configuration when you book.

## Pre-show checklist

1. Confirm the **exact console model**, stage boxes and firmware with the rental company.
2. Open your file in the **offline editor** at the matching firmware version.
3. Update **routing** to match the rental's I/O, and save a version for this venue.
4. Bring the file on **USB, cloud and laptop**.
5. Load the show, then **line check every input and output**.
6. Save a **new show file** at the end of the night with the venue name.

## For promoters and production managers

If you're advancing a show with a guest engineer, ask them three questions:

- Which console and firmware is the show built on?
- How many inputs, outputs and stage boxes do they expect?
- Do they need a recording or virtual soundcheck setup?

Pass those answers to your backline company. It's the easiest way to save an hour on show day. More on this in [the production advance](/blog/production-advance-checklist).

Bringing a show to Los Angeles? We rent Midas M32 and Allen & Heath dLive systems — browse [digital mixing](/catalog?category=Digital%20mixing) or [send us the details](/#inquire).
`,
};

export default post;
