import type { Post } from "../types";

const post: Post = {
  slug: "wireless-frequency-coordination-los-angeles",
  title: "Wireless Frequency Coordination in Los Angeles: A Field Guide",
  seoTitle: "Wireless Frequency Coordination in Los Angeles",
  description: "How to plan wireless microphone and in-ear frequencies in one of the busiest RF cities in the country — legal bands after the 600 MHz repack, scanning, intermodulation, antennas and show-day habits.",
  category: "Wireless",
  published: "2026-10-19",
  keywords: ["wireless frequency coordination", "RF coordination Los Angeles", "600 MHz wireless mic", "wireless microphone frequencies", "intermodulation", "IEM frequency planning"],
  related: ["sennheiser-ew-dx-vs-ew-500-g4", "in-ear-monitor-setup-sennheiser-ew-iem-g4", "wireless-microphone-battery-management"],
  body: `
Los Angeles is a hard place to run wireless. The region has a large number of over-the-air TV stations, many broadcasting from Mount Wilson with a clear view of the whole basin. Add film and TV production, stadiums, convention centers and dozens of venues running shows every night, and clean UHF spectrum is genuinely scarce. Good coordination is the difference between a clean show and a dropout in the middle of the keynote.

## Know which frequencies you can legally use

In the United States, most professional wireless microphones and IEMs operate in the **UHF TV band**, sharing spectrum with television stations. A few rules every production should know:

- **The 600 MHz band is gone.** Since July 2020, wireless microphones can no longer operate in the 600 MHz service band (617–652 MHz and 663–698 MHz). Those frequencies now belong to mobile carriers.
- **Older gear may be illegal to use.** Wireless systems that tune only within the 600 MHz service band can't legally be used in the US anymore, and the 700 MHz band has been off-limits since 2009. Check the frequency range printed on older gear before you use it.
- **Avoid TV channel 37** (608–614 MHz), which is reserved for radio astronomy and medical telemetry.
- **A few narrow slivers remain.** The FCC still allows unlicensed wireless mics in parts of the 600 MHz guard band (614–616 MHz) and duplex gap (657–663 MHz), with licensed use at 653–657 MHz.
- **Licensed operation** under FCC Part 74 is available to eligible professional users and gives some additional protections and power allowances. Most smaller productions operate under the unlicensed rules.

When you rent, make sure the gear you're getting is in a range that's legal and clean for the venue's location. Ask your rental company which frequency ranges their systems cover.

## Why Los Angeles is especially crowded

TV stations occupy fixed channels, and in LA many of the channels in the remaining UHF band are occupied. What's left has to be shared by every wireless system in the area: your show, the venue next door, a film shoot down the block, a news van in the parking lot. Coordinate for the **specific venue address**, not just "Los Angeles" — a hilltop in Silver Lake sees different stations than a ballroom in Long Beach.

## Scan the room, at show time

Online databases tell you where TV stations are, but they don't show what's happening in your room. Before you assign frequencies:

1. **Scan at the venue** with your receivers or a dedicated spectrum analyzer, ideally with lighting, LED walls and video powered up.
2. **Scan again close to show time.** Other productions and broadcast trucks arrive late.
3. **Save the scan** and import it into your coordination software so frequencies are picked around what's actually there.

Sennheiser's **Wireless Systems Manager (WSM)** works with networked evolution wireless receivers such as the [EW 500 G4](/catalog/sennheiser-ew-500-g4) and IEM G4 for scanning, calculating and deploying frequencies. EW-DX systems can be set up with Sennheiser's Smart Assist app or managed in WSM.

## Understand intermodulation

When two or more transmitters operate near each other, they mix in receivers and in the air to create **intermodulation (IMD) products** — phantom signals at predictable frequencies. With analog systems, if a product lands on one of your channels, that channel gets noise or dropouts.

- The strongest are **third-order products** (2F1 − F2 and 2F2 − F1).
- They get worse when transmitters are **close together** — a band in a tight huddle, or IEM transmitters sharing a combiner.
- Coordination software picks **compatible frequency sets** that keep products away from your channels.

Digital systems like the [EW-DX](/catalog/sennheiser-ew-dx) are designed for an **equidistant channel grid**, which avoids most intermodulation planning between EW-DX channels and fits more channels into the same space. They still need to be coordinated around TV stations, other systems and especially your IEM transmitters.

## Plan mics and in-ears together

In-ear transmitters are the loudest RF devices on most stages — they transmit continuously from the side of the stage, often at higher power than a handheld mic. A combined plan should:

- **Separate IEMs from mics in frequency.** Many engineers keep IEMs in one part of the band and mics in another.
- **Separate them physically.** Keep IEM transmit antennas several feet away from mic receive antennas, and don't point them at each other.
- **Use a combiner** for multiple IEM transmitters into one antenna, so you're not running a forest of whips. For G4 in-ears, Sennheiser's AC 41 combines up to four transmitters.

See our [IEM G4 setup guide](/blog/in-ear-monitor-setup-sennheiser-ew-iem-g4) for antenna and pack details.

## Antennas matter more than power

Most dropouts are antenna problems, not frequency problems. A few rules:

- **Get antennas up and in line of sight** with the performers — above the crowd, not behind the stage wall or under a riser.
- **Use antenna distribution** for more than one or two receivers, and remote directional antennas for large rooms and outdoor stages.
- **Keep antenna cable runs short**, or use low-loss coax. Long cheap cables waste signal.
- **Keep receivers and antennas away from LED walls, LED processors and video gear**, which can radiate noise right in the UHF band.
- **Don't let transmitters touch the body more than necessary**, and keep bodypack antennas straight and away from sweat and metal.

## Build in spares

A coordinated plan should always include **backup frequencies** you can switch to quickly, and at least one **spare transmitter** pre-tuned and ready on stage. For important vocals, consider a spare handheld on a separate channel, already in the console.

## Show-day routine

1. Scan the room and confirm the plan.
2. Program and sync every transmitter and receiver; label each with channel name and frequency.
3. **Walk test**: walk every performer's area with each transmitter, including the edges of the stage and any audience walk-out.
4. Check battery levels and log them (see [battery management](/blog/wireless-microphone-battery-management)).
5. Lock transmitters so a stray thumb can't change frequency or mute.
6. Re-scan before doors if new vehicles or productions have arrived.

## When to bring in help

If your show has more than about a dozen RF channels, a broadcast element, or neighbors running wireless, consider a dedicated RF coordinator. At a minimum, give your rental company the venue address and full device count early so they can provide gear in the right frequency ranges.

Running wireless at a Los Angeles show? Our [wireless inventory](/catalog?category=Wireless) covers EW-DX, EW 500 G4 and EW IEM G4. [Send us your channel count and venue](/#inquire) and we'll help you plan it.
`,
};

export default post;
