---
title: "How To: 92-95 Civic Coupe/Hatch Power windows, locks, and mirror DIY conversion"
date: 2023-11-21
type: post
# thumbnail: "/post/honda/eg-civic-power-windows-locks-mirror-conversion/images/thumbnail.jpg"
series: "Honda Info and DIYs"
draft: true
---

It's a lot of work to convert an EG Civic to power windows, locks, and mirrors since most of the wiring is missing on the lower trim models but it's definitely doable.

My hatch is a DX and it didn't come with any features except for AC. That means it has manual windows, mirrors, and locks, no cruise control, and no ABS.

Explain this is the DIY route. DIY harness.

# Quick intro

- What this is for
- Why I'm doing it
- Difficulty level
- Better alternatives

# Supplies

- Door panels
  - If you're lucky you can find the panels with the lower door pouch and optional tweeters!
- Window regulators + motors
  - New is better, but if you go used you can find them with pigtails
  - You must buy power regulators. The manual ones are very different
- Window switches
  - Hard to find coupe ones. Big concern is the mounting bolt hole on the bottom has snapped
- Power lock actuators
  - You can save a buck and buy just the actuators as manual locks have the mounting points for them.
- Power mirrors
- Power mirror switch
- Driver door lock switch
- Door lock control unit
  -14, 16, and 18awg wire
- Several 20a fuses
- Power window relay
  - Both part #s
  - Can use an AC harness one
- EG / EK power door grommets
- Rubber loam for wiring passing through door jam
- Some grommet for door side
- Aftermarket connectors to connect your main harness to the door harnesses.
  - I went with 2 Molex MX150 16 way connectors since they were rated for up to 20a per pin and can handle 14-16awg wire.
- Spare connectors to steal terminals from
- Heat shrink

# References

The information is pretty redundant between the two but I found the eletrical troubleshooting manual to be more indepth as it even included photos of connector locations, and was easier to navigate since it's less bulky than the factory service manual.

| Topic               | Service Manual  | ETM             |
| ------------------- | --------------- | --------------- |
| Dash fuse box       | 23-48, 23-49    | 6               |
| G552                | 23-29, 23-64    | 14-7            |
| Power mirrors       | 23-212 - 23-215 | 141             |
| Power windows       | 23-223 - 23-232 | 120             |
| Power locks         | 23-234 - 23-240 | 130             |
| Sound system        | 23-195 - 23-198 | 150             |
| Connector Locations | 23-22 - 23-43   | 203-14 - 203-26 |

## Connectors

I bought a lot of my components used and cleaned them up because I was able to buy them with pigtail connectors. This made building the harness a lot easier since I didn't have to source as many connectors.

With that said I haven't been able to find anyone still selling the OEM door connectors.

# Prep

- Remove fenders
- Remove door panels
- Remove dash
- Remove HVAC, remove firewall sound deadeing
- Lube up window regulators if you bought used, consider buying new window motors before installing
- - Ensure helper spring is installed.

# Swapping the door guts

- Window regulators
  - Explain how to test windows
  - Explain how to adjust regulator via the bolts / window channel
- Door locks
- Mirrors

# Adding the Missing fuses

- Power window relay
- Bunch o 20amp fuses

# Building the Harness

Show diagram I drew up!

## Driver Door

## Passenger Door

## Cabin

### C555

- Will need to source a connector for C555 as it'll be missing. This plugs into the backside of the fuse box
  - Show photo of the connector
  - Part #
  - Where it plugs into

TODO: Add picture of where the connector goes, and where it looks

### C502

This is the 12 pin blue connector above the fuse box. Every Civic has it since it's used for passing wires from the dash to rear wire harness.

We need to tap into the back side of the connector so we can grab the driver speaker + and -.

There's already going to be wires back there so we can either remove them and set them aside to avoid hacking up the OEM harness. They run to the original driver door harness connector that's only two wires

TODO: Add picture of connector, and pins we want

TODO: I'm thinking I'd like to add a 2pin connector that grabs these. Then I can disconnect the power harness anytime

### C436

This is the 14 pin gray connector above the fuse box. Like C502 every civic has it since it's used for the dash harness. We need to tap into the backside of this connector so we grab the passenger speaker + and 1. There's also going to be wires in these pins but we can de-pin them since we'll be running our own wires.

TODO: Add picture of connector, and pins we want

TODO: I'm thinking I'd like to add a 2pin connector that grabs these. Then I can disconnect the power harness anytime

### C558

This is power mirror switch.

TODO: Show picture!

### G552

This isn't a connector! It's a ground! Wow! It's just a screw that goes into the driver side pillar. Can use some O ring connectors that work with m6 bolts.

We'll be running two wires here so it's easy to send one into the driver door, and one into the passenger door.

### THe DIY Harness

THe harness won't have too many connectors to add.

- 2 wires from C502 (optional 2 pin connector to tap into them)
- 2 wires from C436 (optional 2 pin connector to tap into them)
- New connector for C555 with 4 wires
- Power switch connector
- 2 16 pin Molex for the door harness connectors
