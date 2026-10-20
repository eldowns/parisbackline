import type { Post } from "../types";

const post: Post = {
  slug: "di-boxes-explained",
  title: "DI Boxes Explained: Active vs. Passive and When You Need One",
  seoTitle: "DI Boxes Explained: Active vs. Passive",
  description: "What a DI box does, the difference between active and passive DIs, how many you need for keyboards, bass, playback and laptops, and how ground lift switches help fix hum.",
  category: "Guides",
  published: "2026-10-19",
  keywords: ["DI box", "active vs passive DI", "keyboard DI", "direct box", "stereo DI", "ground lift"],
  related: ["renting-a-nord-stage-3", "stage-power-for-backline", "how-to-read-a-tech-rider"],
  body: `
The humble DI box is on almost every input list and is one of the most frequently forgotten items in a backline order. Here's what it does, which type to use, and how many you'll need.

## What a DI box does

A **DI (direct input) box** takes an instrument-level or line-level signal — from a keyboard, bass, acoustic guitar, laptop or playback interface — and converts it into a **balanced, mic-level signal** the console can use. That does three things:

1. **Lets the signal travel long distances.** Balanced signals can run the length of a stage snake without picking up much noise.
2. **Matches impedance.** High-impedance instrument pickups sound thin and dull when plugged straight into low-impedance inputs. A DI presents the right load.
3. **Isolates grounds.** Many DIs include a **ground lift** switch that can break ground loops and stop hum.

## Passive vs. active

### Passive DI

A passive DI uses a **transformer** and needs no power.

- Great for **line-level sources** with healthy output: keyboards, laptops and playback interfaces
- Very rugged and simple
- The transformer provides good **isolation**, which helps with hum

### Active DI

An active DI has **electronics** that need power — usually phantom power from the console, sometimes batteries.

- Best for **weak or high-impedance sources**: passive bass pickups, piezo acoustic guitar pickups
- Can add **headroom and clarity** for low-output instruments
- Needs phantom power turned on at the console

### Quick guide

| Source | Usual choice |
| --- | --- |
| Keyboards (e.g. Nord Stage 3) | Passive, or active — both work well |
| Laptop / playback interface | Passive (good isolation) |
| Passive bass | Active |
| Acoustic guitar with piezo | Active |
| Active bass or electronics | Either |

## Stereo sources need two channels

Keyboards, playback and many electronic instruments are **stereo**. That means two DI channels per source — either two mono DIs or one **stereo DI**. A keyboard player using the [Nord Stage 3](/catalog/nord-stage-3) with all four outputs needs four channels.

Count DIs per position and add them to the order. Our [Nord Stage 3 guide](/blog/renting-a-nord-stage-3) covers keyboard outputs in more detail.

## Ground lift and hum

If you hear a constant hum when a laptop, keyboard or playback rig is connected, a **ground loop** is likely. The ground lift switch on a DI disconnects the ground connection on the output side, which can break the loop. Try it first before changing anything else.

Hum can also come from power problems — see [stage power for backline](/blog/stage-power-for-backline). Never remove safety grounds from power cables to fix hum.

## Pad switches

Many DIs have a **pad** that reduces signal level. Use it when a hot source — a keyboard at full volume, or a playback interface — overloads the DI or the console preamp.

## Laptops and playback rigs

Laptop-based playback is one of the most common sources of noise on stage:

- Use a **good audio interface** instead of the laptop's headphone output
- Feed the interface outputs into **passive DIs** for isolation
- Keep laptop chargers on the same power as the rest of the position if possible
- Label each channel clearly: tracks, click, cues

## Put DIs on the order

When you send a backline order, list DIs per position:

- Keys: number of outputs
- Bass: active or passive, and whether there's an amp line out too
- Playback: number of channels
- Acoustic instruments: active DIs

It's a small item, but it's often the last thing found at load-in. List it, and it'll be there.

Building a backline order for a show in Los Angeles? [Send us your input list](/#inquire) — we'll make sure the DIs, stands and cables are covered alongside the [gear in our catalog](/catalog).
`,
};

export default post;
