---
title: "Mechanic Log"
description: "Vehicle maintenance tracking SaaS"
featuredImage: "/app/mechaniclog/images/hero.png"
weight: 3
---

Mechanic Log was a web app where users could log repairs and maintenance performed on their vehicle(s). Users could also track fuel mileage to see how much they spent in fuel, gallons consumed, and lifetime MPG. Receipts and invoices could also be saved along with the exact mileage and date services were performed on.

## Features

- Store vehicle information (VIN, license plate)
- Track maintenance and repairs including receipts and invoices
- Track fuel mileage and fill-ups

{{< figure src="/app/mechaniclog/images/hero.png" >}}

# Why I Built It

I built Mechanic Log to scratch my own itch. When you own 2 vehicles, and perform your own maintenance on them you tend to accumulate a lot of receipts for parts quickly. It's difficult to efficiently store all of the receipts, and somehow it's almost always the part that needs to be warrantied out that you can't find the receipt for.

Mechanic Log was an attempt to solve this problem of mine, and I wanted to help others with the same issue so I decided to launch it as a web app anyone could use.

# Tech Stack

The front end was written in Vue.js, and the backend was powered by Node.js and Express. Both the front-end and backend were written in TypeScript. A MySQL database was used for persistence and everything was ran on a Linux server (Ubuntu 18.04).

# What Happened To It?

After working on Mechanic Log for awhile I realized how much more work would be required to make it commercially viable and decided I didn't want to continue supporting it. In order to make the website more useful it would require a mobile app to let users track their fuel mileage easier. It seems no one wanted to bring their laptop with them each time they wanted to fill up a vehicle.
