---
title: "Software Design - Abstraction"
date: 2018-11-08T17:20:42-04:00
categories: ["Software Design"]
type: post
---

Abstraction is Your Friend
===

Do you think the automotive designers who carefully crafted each body line and roll of your car's chassis cared about the engine's cylinder bore or stroke? Or perhaps the firing order, or whether the engine had 2 spark plugs per cylinder akin to Chrysler's hemis?

Of course not, all they cared about was more important details such as the dimensions, mount positions, electrical connections, and plumbing of the engine. To them, the engine was nothing more than the power plant of the vehicle and they were tasked with creating a chassis that could support it.

Then why should the program using your classes have to fully understand the inner-workings of each one in order to fully utilize them? Abstraction promotes simplicity, and elegance that help reduce the overall complexity of code, but only if you actually take advantage of it. 

If a class requires several steps before it can be used, don't write each step as an independent method that needs to be invoked. Instead write *one* initialization method that will take care of all the dirty work for you. You'll thank yourself later when you come back to the program six months down the road and can't remember how to use the class properly. 

Abstraction creates "black boxes" that reduce the number of moving parts you need to have loaded in your mental map of the program at any one time. Instead of worrying about how each one works you can instead focus on connecting each piece of the puzzle to solve the larger problem at hand.
