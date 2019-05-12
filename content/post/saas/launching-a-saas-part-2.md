---
title: "Launching a SaaS - Part 2 The Launch"
date: 2019-03-10
categories: ["SaaS"]
type: post
featuredImage: "/img/saas/launching-a-saas-part-2/1.jpg"
---

# Overview

This is the second part of my blog series about launching a Software as a Service (SaaS) product. I intend for this series to be a collection of the lessons I've learnt along the way, and is meant to be an educational experience. Because learning new things is one of my motivations there will be times where I explore DIYing portions of the project that should typically be offloaded to a third-party.

## Table of Contents

* [Part 1: The Landing Page]({{< ref "/post/saas/launching-a-saas-part-1.md" >}})
* [Part 2: The Launch]({{< ref "/post/saas/launching-a-saas-part-2.md" >}})

# Anatomy Of The Project

I truly underestimated how much work goes into launching a SaaS. It took nearly 2 months of heavy development using all of my free time to bring it to life. In the end I managed to launch a MVP (minimum viable product) that is live at the time of writing this [(link)](https://mechaniclog.net). In order to get to this point I had to set up a database, develop a backend, develop a front end, and deploy it to a Linux server.

## Database

The database is powered by MySQL and handles storing all of the data of the application. I store the users, vehicles, mechanics and more in it. The only part not stored in it is the subscription system as that is all over on Stripe's side.

## Backend

The backend is a RESTful API running on the NodeJS environment. It's powered via Express and follows the onion architecture. It's divided into three main layers: database, logic, and server. The database layer utilizies the repository pattern to create CRUD interfaces for managing models in the database. The repository pattern is quite useful, especially since I'm not using an ORM (object relational mapper). While it might seem silly to not use a ORM I wanted to keep things as simple as possible.

The (business) logic layer is where all of the important work is done. It handles managing database transactions, interacting with multiple database repositories and more. The logic layer is comprised of multiple services that are all specialized in specific tasks.

Lastly, the server layer handles decoding and parsing incoming HTTP requests. The server layer is responsible for directing requests to the appropriate services, and returns the response of the service as an HTTP response to the client.

## Frontend

The frontend is written using Vue. Initially I was using Vuex for state management but Vuex doesn't really work well with TypeScript. Because of this I decided to remove Vuex, and honestly things are much simpler without it.

Vue is a great lightweight option that doesn't have a steep learning curve. I've spent some time using Angular, but with Angular it feels like everything has to be done their way whereas in Vue you can use as much or as little of it as you want.

## Server

For hosting I'm running on a Digital Ocean droplet. Since the server isn't recieving much use I'm currently running the backend, frontend, and databsae all on the same droplet. This helps keep cost low and once the server starts to get overloaded I'll divy each section up into it's own droplet. Until then though I can keep costs ultra low by running a single server.

# Marketing

At the time of writing I currently have no users. I have not begun to market it as I feel I may have launched slighty too soon. For marketing I plan on writing a bunch of evergreen content for anything and everything related to automobiles. I'd also like to work on SEO but I still have a ways to go.

If your interested in checking it out it can be found at [mechaniclog.net](https://mechaniclog.net)

# Photo
- [SpaceX](https://unsplash.com/photos/uj3hvdfQujI)