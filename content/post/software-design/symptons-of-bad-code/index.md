---
title: "Software Design - Symptoms of Bad Code"
date: 2018-12-07T19:59:42-04:00
categories: ["Software Design"]
type: post
---

Admit it, we've all written bad code at some point in our software development careers. One could even argue it's perfectly acceptable to write bad code when the situation calls for it. Bad code is perfect for cranking out [minimum viable products](https://effectivesoftwaredesign.com/2014/11/02/the-minimum-viable-product-and-incremental-software-development/), or implementing a last minute fix for a critical bug in production that has management breathing down the back of your neck waiting for a solution.

The catch-22 however, is that bad code should only be brought to life when it will have a life-span so short that death is already looming in the shadows waiting to snatch it. It occurs all too often that a developer allows a piece of bad code to fester and spread it's disease across the entire code-base, until one day it reaches a point where it has become so entwined with the code-base such that it is no longer feasible to remove it.

In the developer's defense, it's not always easy to spot bad code. Bad code doesn't have an exact definition, nor is there some catalog we can use to identify the various species of bad code we find in the wild like those used by bird watchers. What we can do though, is learn to recognize bad code through common symptoms or [smells](https://martinfowler.com/bliki/CodeSmell.html) it emits. The rest of this article will cover some of the more common symptoms emitted by bad code. It should not be assumed to be a complete set, but instead a stepping stone to help you on your journey as you strive to become a more self-aware developer.

# Mountains of Indentation

![](images/1.jpg)

Escaping from society and exploring nature can be relaxing. For some, going hiking allows them to unplug, and gives them a chance to truly appreciate nature's beauty. However, this is not how other developers feel when traversing through your code. They don't want to discover hidden little streams in the bottoms of valleys, or finally reach the peak only to discover there's a larger peak in the horizon.

Indentation is a way of showing flow control. Therefore, with more indentation, the number of possible unique paths in a program from start to finish increases. Like most topics in Computer Science we have an overly jargony name for this known as [cyclomatic complexity](https://www.tutorialspoint.com/software_testing_dictionary/cyclomatic_complexity.htm).

Cyclomatic complexity can be thought of as a numeric representation of the control flow graph, and the higher the value, the harder the program becomes to comprehend. This requires a developer to understand more of the program before they can safely make a modification to it that won't have unintended consequences.

Not every developer has the time to fully dig their heels in and learn the ins-and-outs of your code. Often times they'll have a looming deadline that is pressuring them to complete the task as quickly as possible. They'll make what they believe to be the "correct" change and move on.

# Every Class Is a Manager

![](images/2.jpg)

This symptom can occur from two different problems. The first possibility, is a poor naming scheme. `Manager` is such a broad term that it's hard to pin it to an exact purpose. Therefore an `XManager` provides nothing useful other than the fact that it does something with `X`.

If a class is tasked with building `Foo` objects then call it something such as a `FooBuilder`, `FooFactory`, or `FooGenerator`. If your designing a class that handles CRUD (Create, Read, Update, Delete) actions on `User` objects then call it something such as a `UserService`, or `UserHandler`. If your really can't think of something other than `Manager`, then perhaps it might be the best choice, but before you make your decision look at some of the other [recommendations](https://stackoverflow.com/questions/1866794/naming-classes-how-to-avoid-calling-everything-a-whatevermanager).

The second problem that can be causing this symptom is poorly designed code. If every class handles multiple tasks then your likely in violation of the first principle when it comes to the [SOLID](https://scotch.io/bar-talk/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
design principles.

For those unfamilar with SOLID, it stands for:

- **S**ingle-responsibility principle
- **O**pen-closed principle
- **L**iskov substitution principle
- **I**nerface segregation principle
- **D**ependency inversion principle

The single responsibility principle means that each class should only be capable of performing a single task. Therefore, if every class is a manager, then likely the design is to blame as each class wears too many hats.

# Useless Comments

![](images/3.jpg)

Without a doubt, if I told you right now to always make sure to comment your code, your eyes would start to glaze over in an involuntary reaction that we all have developed from having this statement drilled into our heads from every article, tutorial, or teacher we've had over the years.

Every developer has their own opinion when it comes to comments. Some argue that code should be "self-documenting" and if comments are needed for clarity then the code itself is the issue. On the other hand, some developers argue that code is inherently bad without comments.

One thing we can all agree on though, is that useless comments truly are useless. Sure it may go against what most teachers have ingrained into us, but if a comment serves no purpose other than to take up a line or two, just remove it. Comments should provide context as to why things are the way they are. If a change was made for a bug fix, then leave a little comment explaining what was going wrong, and why the change was made. Don't simply leave a comment with the ticket number forcing other developers to have to load up a secondary resource for more info.

And no, rewording a property, method, or variable name is not clever, nor useful.

```c#
    public class Classroom {
        /// <summary>
        /// The count of students.
        /// </summary>
        public int StudentCount { get; private set; }
    }
```

# It Uses a Design Pattern, Therefore it Must be Good

![](images/4.jpg)

Software design patterns are like hand tools, each one is designed for a specific purpose. While a saw may be great at cutting a 2x4, use that same saw to hammer in a nail and you're gonna have a bad time. Sure some tools such as a flat head screwdriver may suffice as a pry-bar, but if pushed too far, that screwdriver will begin to bend under pressure and now you have a useless bent screwdriver.

If your using a design pattern simply because you feel it makes your code _correct_ then what your actually doing is lowering your code's quality. If the code doesn't feel natural, and in some cases has increased in complexity, then it'll be in your best interest to take a step back and reevaluate your implementation.

Ever heard of the [YAGNI](http://wiki.c2.com/?YouArentGonnaNeedIt) principle? YAGNI stands for "You Aren't Gonna Need It" and it comes from [ExtremeProgramming](https://martinfowler.com/bliki/ExtremeProgramming.html). It encourages developer to reduce the amount of bloat in their projects by not adding or implementing un-needed features. This helps speed up the development process, and often times when a feature is added preemptively it will be a sub-par solution. This isn't the developer fault, but instead due to the fact that it's hard to plan out exactly what's needed, and how it will be used.

If you were tasked with creating [FizzBuzz](http://wiki.c2.com/?FizzBuzzTest) your first thought (hopefully) wouldn't be to use the [Model-View-Controller](https://blog.codinghorror.com/understanding-model-view-controller/) pattern right? FizzBuzz is one of the infinitely many simple problems out there that don't require, nor need an over-engineered solution.

Imagine your a web developer at a new startup that hasn't launched their website yet. Your boss decides that the company needs to get their name out there and needs a landing page. Hes tasked you with the challenge of creating it, and has given you a mere day to complete it. Your a well experienced developer that knows several JavaScript frameworks (React, Angular, etc...) and you know that the task shouldn't take long, and React would be a perfect candidate, but is it really?

A single webpage is just that, a little HTML, some CSS, and maybe even a sprinkle of JavaScript to make it interactive. There's no need to over complicate a solution and develop using a large framework simply because it uses a proper architecture pattern. Always pick the right tool for the job because in the end, no one cares about how you drilled the hole, they only care about the [hole](https://hbswk.hbs.edu/item/what-customers-want-from-your-products).

## Photos

- ["The view from Lac Blanc..." by Simon Fitfall](https://unsplash.com/photos/tvleqH3p1os)
- ["Size matters" by Joshua Coleman](https://unsplash.com/photos/_yVRLC75Ma8)
- ["Treasure Town" by Camille Villanueva](https://unsplash.com/photos/5IJ9UaT6tLk)
- ["DIY Electrical Board..." by John Carlisle](https://unsplash.com/photos/l090uFWoPaI)
