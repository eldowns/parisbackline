import type { Post } from "../types";

const post: Post = {
  slug: "in-ear-monitor-setup-sennheiser-ew-iem-g4",
  title: "Setting Up Sennheiser EW IEM G4 In-Ear Monitors for a Live Show",
  seoTitle: "Sennheiser EW IEM G4 Setup Guide for Live Shows",
  description: "A step-by-step guide to running Sennheiser EW IEM G4 in-ear monitors: stereo vs. mono, frequency sync, Focus mode, limiter settings, antennas, combiners and the habits that protect performers' ears.",
  category: "Wireless",
  published: "2026-10-19",
  keywords: ["Sennheiser IEM G4 setup", "EW IEM G4 rental", "in-ear monitor rental Los Angeles", "IEM setup", "in-ear monitors live show", "SR IEM G4"],
  image: "/site/equipment/iem-g4.webp",
  related: ["wireless-frequency-coordination-los-angeles", "wireless-microphone-battery-management", "sennheiser-ew-dx-vs-ew-500-g4"],
  body: `
In-ear monitors change a show. Performers hear a consistent mix in every venue, stages get quieter, vocal mics pick up less bleed, and FOH gets a cleaner mix. The **Sennheiser EW IEM G4** is one of the most common systems on riders — here is how to set it up properly.

## What's in the system

An EW IEM G4 system has two main parts:

- **SR IEM G4 transmitter** — a half-rack unit that takes a mix from the console and transmits it. Two of them fit side by side in one rack space.
- **EK IEM G4 bodypack receiver** — worn by the performer, with a headphone output for the earphones.

Many touring performers bring their own **custom-molded earphones**. If they don't, plan universal-fit earphones with a range of tips and hygiene covers. Never share earphones without proper cleaning and fresh tips.

## Stereo or mono?

Each SR IEM G4 transmitter can send **stereo** (left and right) or **mono**.

- **Stereo** gives a more natural, open mix and lets the engineer pan instruments, which often allows lower overall levels — better for hearing. It uses two console outputs per mix.
- **Mono** uses one console output per mix — useful when outputs are limited.

Any number of bodypacks can receive the same transmitter, so a horn section or background vocalists can share one mix, each with their own pack.

## Focus mode

The EK IEM G4's **Focus** mode is useful when console outputs are tight. The engineer sends two different signals on the left and right channels — for example, the band on one side and the performer's own vocal on the other. In Focus mode, both are heard in both ears, and the performer uses the balance control to set how much of each they hear. It turns one stereo transmitter into a personal two-ingredient mix.

## Frequency setup and sync

1. **Coordinate IEM frequencies together with the show's wireless mics.** IEM transmitters run continuously and are strong; they need to be part of the whole-show plan. See [wireless frequency coordination in Los Angeles](/blog/wireless-frequency-coordination-los-angeles).
2. Set the transmitter's frequency (or use a scan and pick a free channel).
3. **Sync** the bodypack to the transmitter over infrared: hold the pack's IR window close to the transmitter's sync window and press sync. This copies frequency and settings.
4. Label every transmitter and pack with the mix name and frequency.

The G4 IEM system offers up to 1,680 tunable frequencies across a 42 MHz switching range. Like any analog system, multiple IEM transmitters need intermodulation-free frequency sets — coordination software will calculate those.

## Transmitter RF power

The SR IEM G4 offers selectable RF output levels. More power isn't automatically better: on a small stage, lower power reduces intermodulation and interference with other systems. Use higher power for large stages, outdoor shows and long distances to the performer. Whatever you choose, keep it consistent across transmitters sharing a combiner.

## Antennas and combiners

- A single transmitter can use its own antenna, but **multiple transmitters should go through an antenna combiner**. Sennheiser's AC 41 combines up to four SR IEM G4 transmitters into one antenna, reducing the number of antennas on stage and improving reliability.
- A **directional antenna** pointed at the stage gives better coverage than whip antennas on the rack, especially when the rack lives side-stage behind gear.
- Keep IEM transmit antennas well away from the **wireless microphone receive antennas**.
- Walk test the stage and any spots performers go into the crowd.

## Limiter, levels and protecting hearing

In-ears put sound directly into the ear canal. Treat levels seriously.

- Use the bodypack's **limiter** to cap maximum output. Set it with the performer present.
- Start the **bodypack volume low** and bring it up. Ask performers to turn down, not up, when the mix feels crowded.
- Add **ambient microphones** to the mix so performers hear the crowd and the room; it reduces the urge to take one ear out (which tends to make people push levels).
- Avoid feedback squeals and pops: mute IEM sends before plugging and unplugging, and power transmitters on before packs.

## Wired backup

Keep a **wired headphone amplifier** fed from the same mix for drummers or keys players who are stationary — it's a no-RF fallback if something goes wrong. Many drummers prefer wired packs anyway.

## Batteries

The EK IEM G4 runs on AA batteries or Sennheiser's rechargeable pack. Fresh batteries for every show, and spares on stage. Our [battery management guide](/blog/wireless-microphone-battery-management) covers swap schedules and logging.

## Line check

Before soundcheck:

1. Confirm each pack receives with full RF and audio.
2. Send pink noise or music through each mix and check left/right balance.
3. Have each performer walk their stage area with their pack on.
4. Confirm talkback reaches every mix.

## Renting IEMs in Los Angeles

When you order in-ears, include:

- Number of **mixes**, stereo or mono
- Number of **bodypacks** per mix, plus at least one spare pack
- Whether performers bring their own **earphones**
- **Antenna** and combiner needs
- The venue address for frequency planning

We rent [Sennheiser EW IEM G4 systems](/catalog/sennheiser-ew-iem-g4) across Greater Los Angeles. [Tell us about your show](/#inquire) and we'll help spec the right number of mixes, packs and antennas.
`,
};

export default post;
