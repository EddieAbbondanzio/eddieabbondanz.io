---
title: "Unity - LiteNetLib's Delivery Methods"
description: "Understanding the differences."
date: 2019-11-14T21:31:00-00:00
lastmod: 2019-11-17T12:12:00-00:00
author: "Eddie Abbondanzio"
category: "Game Dev"
tags: ["Unity", "LiteNetLib", "UDP"]
type: post
featuredImage: "/post/unity/litenetlib-delivery-methods/images/hero.jpg"
---

While LiteNetLib may run on [UDP (User Datagram Protocol)](https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/) which is an unreliable network protocol, LiteNetLib offers multiple delivery methods, some of which even offer "reliability". Reliability is in quotes because when latency is high the chance of a packet being dropped is greater than 0 (although still fairly rare).

In total, LiteNetLib offers 5 different delivery methods for sending packets to peers. They are as follows:

- Unreliable
- ReliableUnOrdered
- Sequenced
- ReliableOrdered
- ReliableSequenced

# Unreliable

`Unreliable` is standard UDP. There is no guarentee that a packet will be succesfully delivered to it's destination, and if it does, there's a chance more than 1 copy of it could arrive. Unreliable is best for data that needs to be sent over and over as quickly as possible. Player positions in a first person shooter would be a perfect example since they're constantly changing and a lost packet or two doesn't have much effect overall.

# ReliableUnordered

`ReliableUnordered` provides a reliable channel with the smallest performance hit possible. Any packet sent will be delivered, and only 1 copy of it will ever be delivered. The only downside is there's no promise what order the packets are delivered in. If packet A and packet B were sent in order AB they could arrive as AB, or BA. This channel is useful for sending duplicates such as a weapon firing event. It's irrelevant which bullet was fired, we just need to know that a bullet was fired, and ensure that every bullet is accounted for.

# Sequenced

`Sequenced` is another unreliable delivery method. Unlike unreliable, it ensures only 1 copy of a packet will be delivered (if it is delivered), and the packets always arrive in order.

# ReliableOrdered

`ReliableOrdered` is as the name implies, a reliable delivery method that prevents duplicates. It also ensures packets are delivered in the same exact order they're sent. Unlike ReliableUnordered if packet A and packet B were sent in order AB they'll always arrive in order AB. Because of the slight performance hit only use ReliableOrdered if the order is truly a requirement. Otherwise, opt for ReliableUnordered.

# ReliableSequenced

Last but not least, `ReliableSequenced`. Similar to `ReliableOrdered` it ensures packets will always be delivered in order, and no duplicates will be delivered. It does not guarentee that every packet will be delivered, instead only the last packet is guarenteed to be delivered. This would be useful for something such as a countdown timer sending out updates to listeners. It's not the end of the world if a packet is lost during the countdown, but the last packet (timer ending) is important.

# Summary

Always be sure to pick the least restrictive delivery method when sending data. The more restrictions the delivery method enforces, the higher performance cost it comes with.

| Delivery Method   | Reliable | Ordered | Prevents Duplicates |
| ----------------- | -------- | ------- | ------------------- |
| Unreliable        | No       | No      | No                  | No |
| ReliableUnordered | Yes      | No      | Yes                 |
| Sequenced         | No       | Yes     | Yes                 |
| ReliableOrdered   | Yes      | Yes     | Yes                 |
| ReliableSequenced | Yes\*    | Yes     | Yes                 |

\* Last packet only
