---
title: "Detailing Arsenal"
description: "Scheduling software for auto detailers"
featuredImage: "/app/detailingarsenal/images/hero.png"
weight: 1
---

Detailing Arsenal is a SaaS (software as a service) for managing and scheduling appointments for auto detailers. Users can create, update, or delete appointments, along with the ability to view stats about time, services, and revenue. The app is focused towards auto detailing as the industry has some unique requirements such as vehicle check-in inspections and more that generic scheduling apps didn't offer.

## Features

- Create, update, delete appointments
- View schedule in week or daily format
- Track revenue per service
- Time management reports
- Generate custom invoices

{{< figure src="/app/detailingarsenal/images/hero.png" >}}

# Why I Built It

Like Mechanic Log I built this to scratch my own itch. When running an auto detailing business as a one man show it can be difficult to track my schedule so I created a web app that could fulfill my needs. The app also has basic CRM (customer relationship management) features.

# Tech Stack

The site is built using Vue.js and the backend is an ASP.NET Core Web API. PostgreSQL is used for data persistence. Auth0 is used for user authentication.

The frontend uses Vuex for state management, and the backend adheres to domain driven design.

# What Happened To It?

The app is currently in (very early) production, and has pivoted. It's now a website where detailers can compare buffing pads and leave reviews. Choosing buffing pads is difficult for detailers because each and every manufacturer has their own "system". Currently the best method to find out which ones are good is to browse online forums and see what others recommend. The new goal of the site is to simplify this process and help detailers find the right pads.
