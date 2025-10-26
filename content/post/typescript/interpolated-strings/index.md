---
title: "TypeScript - Interpolated Strings"
date: 2019-02-01
type: post
thumbnail: "/post/typescript/interpolated-strings/images/1.jpg"
categories: "Development"
---

Coming from the .NET world `String.Format()` was by far my most used function for generating user readable error / log messages. After jumping over to TypeScript, I was bummed to learn that no similar function existed. However, it wasn't so bad, after all `console.log()` allows us to pass multiple parameters and has no trouble logging them.

```js
let foo = { bar: 1 };
console.log("Foo is ", foo);
//Prints: Foo is Object { bar : 1 }
```

But this only covers one of the many use cases I used `String.Format()` for. Disappointed with TypeScript, I decided to do some searching online. Surely I couldn't be the only one with this frustration?

Thanks to my scrutinizing research efforts (aka a couple Google searches) I discovered it was not TypeScript that was lacking, but instead it was a failure on my part to understand string interpolation. Things didn't really click until I came across a StackOverflow question from someone else who was facing a similar issue. The top answer of the post advised them to use string interpolation.

String interpolation sounds intimidating. I actually remember reading about it awhile ago when I came across an article covering the new features of C# 6.0. At the time however, it never clicked to me how useful it truly was and I assumed it was simply above my pay-grade.

Without `String.Format()` as my crutch though, my only other option was to manually join strings together and it felt gross.

```js
let foo = { bar: 1 };
alert("Foo is " + foo.bar + ".");
//Yuck
```

I decided to look up the definition of interpolation since it sounded like jargon to me. Google defines interpolation as:

> _noun_

> 1. the insertion of something of a different nature into something else.

Hmm, that sounds kinda useful. A bit more research and I learned that in JavaScript / TypeScript they are referred to as _template strings_. And just like that, the fog of several months of ignorance lifted. All this time I had been overlooking such a simple concept because it had a daunting name.

String interpolation had fallen victim to the classic Computer Science theme of overly complicated, jargony names for simple concepts such as _Dependency Injection_.

String interpolation allow us to create strings using local variables as if we were writing a standard line of code.

```js
let name = "Bert";
console.log(`Hello there ${name}!`);
//Prints: Hello there Bert!
```

The only requirement to use them in TypeScript is to change the quotation marks surronding the string to the backquote character \`. Then anytime we want to insert a value into the string we use the `${}` syntax.

When inside a `${}` we can even use class methods.

```js
    let name = 'Bert';
    console.log('HI ${name.toUpperCase()});
    //Prints: HI BERT
```

Functions are also fair game.

```js
function doubleIt(value: Number): number {
  return value * 2;
}

console.log(`2 * 2 is ${doubleIt(2)}`);
//Prints: 2 * 2 is 4
```

And lastly, if we wanted to print a variable but we are unsure if the variable is null, we could perform a quick null check directly in the string.

```js
    let name = null;
    console.log(`Players name is: ${name || 'Unknown'});
    //Prints: Players name is Unknown
```

Interpolated strings have quickly grown to be one my favorite features. Even on the C# side I find myself using interpolated strings over `String.Format()` as it feels cleaner in my opinion. Looking back my only regret is not giving string interpolation a chance sooner. I mistakenly judged a book by it's cover instead of taking the time to learn more.
