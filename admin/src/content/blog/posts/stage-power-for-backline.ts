import type { Post } from "../types";

const post: Post = {
  slug: "stage-power-for-backline",
  title: "Stage Power for Backline: Avoiding Hum, Trips and Surprises",
  seoTitle: "Stage Power for Backline: Avoiding Hum and Trips",
  description: "How to plan power for backline and audio on stage: dedicated circuits, separating audio from lighting, ground loops and hum, international voltage, and safe cable runs.",
  category: "Guides",
  published: "2026-10-19",
  keywords: ["stage power", "backline power", "audio hum ground loop", "power distribution stage", "live sound power", "international voltage backline"],
  related: ["di-boxes-explained", "production-advance-checklist", "how-to-read-a-tech-rider"],
  body: `
Power is the least glamorous part of a show and one of the most important. Bad power causes hum, buzzing, digital glitches, tripped breakers and, at worst, damaged equipment and safety hazards. A little planning prevents almost all of it.

> Safety first: power distribution in venues should be handled by qualified electricians and the venue's technical staff. This guide covers planning and good practice, not electrical work.

## Ask the venue the right questions

During the [advance](/blog/production-advance-checklist), confirm:

- Where **power** is available on stage and at FOH
- Whether audio has **dedicated circuits** separate from lighting and video
- How many **circuits** and what capacity are available at each position
- Whether a **generator** is involved (common outdoors)
- Who on site can help if a breaker trips

## Keep audio separate from lighting

Lighting dimmers, LED fixtures and video walls can put electrical noise on the power they share. Audio — consoles, stage boxes, amps, keyboards and wireless receivers — should be on **separate circuits** from lighting and video whenever possible. Many venues have a dedicated "audio power" distribution for exactly this reason.

## Power every position from the same source

Ground loops happen when connected equipment is powered from different sources with different ground potentials. The result is hum or buzz. To reduce the risk:

- Power the **whole backline and audio system** from the same distribution where possible
- Power a keyboard rig, its laptop and its interfaces from the **same power strip**
- Avoid powering one piece of a rig from stage power and another from a wall outlet across the room

If hum appears, try the **ground lift** on the DI box first — see [DI boxes explained](/blog/di-boxes-explained). **Never** remove or defeat the safety ground on a power cable.

## Plan for each position

Walk the stage plot and list what needs power at each position:

| Position | Typical needs |
| --- | --- |
| Keys | Keyboards, laptop, audio interface, sometimes a small mixer |
| Guitar / bass | Amps, pedalboards |
| Drums | Electronic pads, click, IEM packs on wired amp |
| Playback / MD | Laptops, interfaces, network switch |
| Wireless / RF | Receivers, IEM transmitters, antenna distribution |
| FOH | Console, computer, outboard |

Run a power drop to each position and tape it down clean. Don't daisy-chain power strips.

## International artists and voltage

US power is 120 V at 60 Hz. Artists arriving from countries that use 220–240 V may bring gear that isn't rated for 120 V.

- Many modern devices have **universal power supplies** (marked 100–240 V) and only need a plug adapter
- Gear rated only for **230 V** needs a properly rated **step-up transformer**, or should be rented locally
- Some vintage gear is sensitive to **frequency** (50 Hz vs. 60 Hz)

Ask in the advance what needs special power. Renting standard US-voltage backline locally is often the simplest solution.

## Digital gear and power

Digital consoles, stage boxes and wireless receivers don't like sudden power loss. Consider:

- A **UPS** (uninterruptible power supply) for the console and stage box, so a brief interruption doesn't reboot the system mid-show
- Power-up order: **source gear first, amplifiers last**; power-down in reverse
- Leaving digital gear **powered on** through the show day once it's set up

## Generators outdoors

Outdoor shows often run on generators. Confirm that the generator has enough capacity for audio, that audio has its own distribution, and that the generator is placed far enough from the stage and audience to keep noise and fumes away.

## Cable safety

- **Tape or cover** power runs across walkways
- Keep power and audio cables **separated** where possible, crossing at right angles
- Don't run cables where drinks are likely to spill
- Keep cable runs **neat**: it helps troubleshooting as much as it helps safety

## The short version

Separate audio from lighting, power each rig from one source, ask about international gear early, protect digital gear from interruptions, and leave electrical work to qualified people.

Planning backline power for a Los Angeles show? Note your power needs when you [send us your rider](/#inquire), and we'll help you plan each position.
`,
};

export default post;
