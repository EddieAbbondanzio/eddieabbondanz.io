---
title: "TypeScript - Taking The Magic Out of Magic Strings"
date: 2019-01-05T09:53:42-04:00
type: post
categories: ["TypeScript"]
featuredImage: "/post/typescript/magic-strings/images/1.jpg"
---

# What's so Magical About Magic Strings?

Magic strings are string literals strewn about a code base that apply some kind of limitation to the code. They can be used to filter valid input, constrain parameters, or control the behavior of code.

They are often considered an anti-pattern due to how to they introduce the potential for bugs when typos occur, or by the difficulty they create when the need to change a magic string occurs.

If the need to change a magic string does ever arise, it will require the developer to hunt down each and every use of the string throughout the code base. This is no easy task, especially for larger, or legacy code bases.

# TypeScript to the Rescue

TypeScript has a powerful type system that when used properly can improve a developers life seven fold. Personally, I've come from a C# background, and TypeScript has often felt quirky when dealing with it, but I've slowly grown to love this.

One of the capabilities offered by TypeScript is to create types limited to specific instances of strings. This ability can be used to create string based enums that reduce the amount of typing requried by the developer, while at the same time producing code that is clear and concise.

# A Working Example

Imagine we were working with objects that represent database columns, and needed an enum to represent the various data types. While we could simply define an enum as follows:

```js
export enum DatabaseColumnType {
    Boolean,
    Date,
    String
}
```

TypeScript offers us the ability to represent these as a collection of string literals.

```js
export type DatabaseColumnType = "Boolean" | "Date" | "String";
```

If we had a `DatabaseColumn` object like so:

```js
export class DatabaseColumn {
    constructor(public type: DatabaseColumnType, value: any) {
    }
}
```

Then we could specify the column type directly through strings instead of having to append `DatabaseColumnType` before the enum each time we used it.

```js
let col: DatabaseColumn = new DatabaseColumn("Boolean", true);
```

The TypeScript compiler is smart enough to reject invalid strings that do not exist on the type.

```js
let col: DatabaseColumn = new DatabaseColumn("Foo", 1);
//Throws compile time error
```

While this may seem seem lazy on the developers end, it does offer us an advantage to produce simple, and highly readable code.

# Photo

[By Clever Visuals](https://unsplash.com/photos/iMwiPZNX3SI)
