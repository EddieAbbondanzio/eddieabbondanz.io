---
title: "TypeScript - Await Promise.All() And Get The Results"
date: 2020-03-15
type: post
thumbnail: "/post/typescript/await-promise-all/images/featured.jpg"
category: "Development"
---

I'm a big fan of the `async` `await` syntax in ES2017. In my opinion it just feels a lot more natural than [and then and then and then...](https://www.youtube.com/watch?v=CkdyU_eUm1U). I digress. I'll keep this one short.

`Promise.all()` allows us to run multiple async operations in parallel instead of running them in series. This is great for times when we need to make multiple API calls that are independent of each other.

Imagine we had two long running task like so:

```ts
async function getFoo(): Promise<Foo> {
  // magic
}

async function getBar(): Promise<Bar> {
  // more magic
}
```

And they take so long that calling them in series was frustrating your users who can't wait more than a few seconds for something to load.

```ts
var foo = await getFoo();
var bar = await getBar();
// too slow!
```

So we need the assistance of `Promise.all()` to run them in series. But we also need to get the values back. `Promise.all()` takes an input of an array. This is important to remember as it's easy to pass them as seperate parameters and wonder why it only returns the first promise.

```ts
// bad
await Promise.all(getFoo(), getBar());

// good!
await Promise.all([getFoo(), getBar()]);
```

When awaited `Promise.all()` returns an array of results that matches up with the inputs. Therefore when we pass an input of `[Promise<Foo>, Promise<Bar>]` the output will be `[Foo, Bar]`. And best of all when paired up with [array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) it feels perfectly natural.

```ts
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

console.log(foo);
console.log(bar);
```

Enjoy your newly found knowledge and happy coding!
