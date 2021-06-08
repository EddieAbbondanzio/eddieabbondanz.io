---
title: 'Abusing For Loops In C# For Job Security'
date: 2021-01-11
type: post
series: 'Development'
thumbnail: '/post/c-sharp/abusing-for-loops-for-job-security/images/hero-thumbnail.jpg'
featuredImage: '/post/c-sharp/abusing-for-loops-for-job-security/images/hero.jpg'
---

Everyone knows good code is easy to maintain, but that also means anyone can maintain it. That's no bueno for the individual developer who wants a little job security. Writing overly complex code that nobody else can maintain let alone read, will ensure your company holds onto you, and will give you more bargaining power come raise time.

We're going to work with a simplified example for the rest of this article. Imagine your boss has asked you to write a program that will count from 1 to 9 and print out the number, along with if it is even. A valid output would be as follows:

```
1 is even: False
2 is even: True
3 is even: False
4 is even: True
5 is even: False
6 is even: True
7 is even: False
8 is even: True
9 is even: False
```

Your boss might've said this would be part of the test suite for the NPM package [is-even](https://www.npmjs.com/package/is-even) but you stopped listening about halfway through to figure out how many story points this would be on the next sprint.

Oh well, sounds easy enough right? Any developer worth their salt knows a simple for loop could solve this problem.

```
for (int i = 1; i < 10; i++) {
  Console.WriteLine($"{i} is even: {i % 2 == 0}");
}
```

But as correct as this solution might be, it doesn't guarantee us job security which is after all the most important principle of good code.

Time to add a little complexity to ensure no one else will dare touch the code, or try to understand it.

# Anatomy of a For Loop

Just so we're all on the same page, a for loop is comprised of a statement, and a body.

The statement is the portion which sits atop the loop and is within parenthesis. It's divided into three parts. Each of which is separated by a semi-colon.

```
for(initializer; condition; iterator) {}
```

1. initializer: The initializer is the first part, and usually instantiates a variable. Say `int i = 0;`
2. condition: The condition is the middle portion and is checked each pass of the loop to ensure it's true. When the condition tests false, the loop is exited.
3. iterator: The last portion is the iterator, this is typically used to increment the loop variable ex: `i++`.

All 3 parts of the statement are optional, and an empty for loop `for (; ;) { }` will act like an infinite while loop `while(1) { }`.

The body is the portion of the loop below the statement. Usually surrounded by curly braces, unless it's one line (as they're optional then). I should also mention that the body is optional too.

Let's go ahead and start writing our _ahem_ abomination.

# Moving the Domain Logic Into the For Statement

First off we've got some domain logic operating inside the for loop body. The ternary that detects if the number is even: `i % 2 == 0`. Let's go ahead and squeeze it into the for statement because after all that's where it belongs.

We're going to need an extra variable to hold a `isEven` flag. But, there's a bit of a problem. C# only allows for defining multiple variables of the same type in one line. So while the following is perfectly valid:

```
for(int a = 0, b = 0; i < 10; i++) {}
```

This is not:

```
for(int a = 0, bool isEven = false; i < 10; i++) {}
```

But that's okay because we'll slap it in a value tuple and deconstruct it.

```
for(var (i, isEven) = (1, false); i < 10; i++) {}
```

Now that's beautiful.

With the bool instantiated we just need to recalculate it each time in the iterator. Thankfully C# is cool with assigning multiple variables of different types on the same line.

```
for (var (i, isEven) = (1, false); i < 10; i++, isEven = i % 2 == 0) { }
```

And now our for loop body has been devoided of any logic. It's clean and concise.

```
for (var (i, isEven) = (1, false); i < 10; i++, isEven = i % 2 == 0) {
  Console.WriteLine($"{i} is even: {isEven}");
}
```

# Obfuscating The Start And End

I'd argue `i < 10` is too readable. Since the condition just needs to be a boolean we can substitute it with anything we please provided it evaluates to `true` or `false`. Which basically makes it a no-brainer to swap it out with a switch expression.

```
for (var (i, isEven) = (1, false); i switch { 10 => false, _ => true }; i++, isEven = i % 2 == 0) {
  Console.WriteLine($"{i} is even: {isEven}");
}
```

The switch expression will still run our loop from 1 to 9 as intended. Each iteration of the loop it'll see which case it matches i against. The underscore (or discard) is equivalent to the default case of a switch statement. Therefore while i is not 10 it'll return true which means keep running the loop, and once it hits 10 the switch will return false saying it's time to stop.

But we can take this a step further and add erroneous cases. As long as the switch never hits said cases it doesn't mess with the logic.

```
for (var (i, isEven) = (1, false); i switch { 10 => false, 14 => true, 69 => false, 420 => true,_ => true }; i++, isEven = i % 2 == 0) {
  Console.WriteLine($"{i} is even: {isEven}");
}
```

And on top of that they don't even have to be in order. Also note that erroneous cases can return `true` or `false`. This is extra important to add another layer of confusion.

```
for (var (i, isEven) = (1, false); i switch { 14 => false, 69 => true, 10 => false, 420 => true, _ => true }; i++, isEven = i % 2 == 0) {
  Console.WriteLine($"{i} is even: {isEven}");
}
```

For the finishing touch let's kick it up a notch. A switch case has to be a literal or constant, which removes the usages of methods, and the such but still leaves math on the table.

```
for (var (i, isEven) = (1, false); i switch { 14 * 4 => false, 69 * 250 / 84 => true, 10 => false, 420 => true, _ => true }; i++, isEven = i % 2 == 0) {
  Console.WriteLine($"{i} is even: {isEven}");
}
```

I recommend leaving the math a fifth grade level. We want to give the reader a flash back to their day in grade school learning their multiplication tables.

Oh and did I mention we can add some math and more to the return values? After all they just need to be booleans.

```
for (var (i, isEven) = (1, false); i switch { 14 * 4 => false, 69 * 250 / 84 => 8 / 2 == 4, 10 => false, 420 => 7 * 6 == 92, _ => true }; i++, isEven = i % 2 == 0) {
  Console.WriteLine($"{i} is even: {isEven}");
}
```

# Finishing Up In 1 Line

We're not done yet. Our solution is optimal, but everyone knows that a 1 line solution is **always** better. Right now you're either begging for mercy or thinking there's no way it's possible. Even if we removed the brackets it's still 2 lines.

```
for (var (i, isEven) = (1, false); i switch { 14 * 4 => false, 69 * 250 / 84 => 8 / 2 == 4, 10 => false, 420 => 7 * 6 == 92, _ => true }; i++, isEven = i % 2 == 0)
  Console.WriteLine($"{i} is even: {isEven}");
```

But if there's a will there's a way.

Our next magic trick is going to involve a little inspiration from JavaScript. Have you ever heard of a self invoking function? It's basically a function declaration that immediately executes itself.

```
(function () {
  console.log("foo");
})();
// prints "foo" to the console
```

And while we may be in the .NET world, who's to say we can't borrow a little inspiration?

```
new Action(() => Console.WriteLine("foo"))();
// prints "foo" to the console
```

Let's take our new found knowledge and replace the iterator of our loop. Because after all when all you've got is a hammer, everything looks like a nail.

```
for (var (i, isEven) = (1, false); i switch { 14 * 4 => false, 69 * 250 / 84 => 8 / 2 == 4, 10 => false, 420 => 7 * 6 == 92, _ => true }; (i, isEven) = new Func<int, (int, bool)>((i) => (i + 1, !(i % 2 == 0)))(i)) {
    Console.WriteLine($"{i} is even: {isEven}");
}
```

This is the little bit we added.

```
new Func<int, (int, bool)>((i) => (i + 1, !(i % 2 == 0)))(i)
```

A Func<> is the same thing as an Action except it can have parameters, and a return value. In our instance, the function takes an int parameter, and returns a value tuple containing an int, and bool. Make sure you name your function parameters the same as the variable being passed in.

The real reason why we added in the self invoking function isn't to make it more confusing. No. We just needed a new location to place our `Console.WriteLine()` call.

That my friends is how we can achieve our glorious one liner solution.

```
for (var (i, isEven) = (1, false); i switch { 14 * 4 => false, 69 * 250 / 84 => 8 / 2 == 4, 10 => false, 420 => 7 * 6 == 92, _ => true }; (i, isEven) = new Func<int, (int, bool)>((i) => { Console.WriteLine($"{i} is even: {isEven}"); return (i + 1, !(i % 2 == 0)); })(i));

```

Here's the self invoking function for those who somehow have trouble reading our work of art.

```
new Func<int, (int, bool)>((i) => { Console.WriteLine($"{i} is even: {isEven}"); return (i + 1, !(i % 2 == 0); }(i)
```

# Wrapping Up

We could take things further, but before doing some I'd recommend assessing the rankings of your co-workers. If you work alongside a lot of junior devs, it's probably sufficient, but if you work with more senior developers we could always break out a few more tricks. I'll leave this as an exercise for the reader.

With everything coded up, and testing good, it's time to commit your masterpiece and send off some requests for code reviews. Come to think of it it's probably about time to head on home as this likely took most the day. Go home and enjoy some brews. Because tomorrow when your boss calls you into his office it's gonna be for that promotion you've been wanting.

# Acknowledgements

Thank you Chris Cattano for pointing out I had a logic error in the code bits after switching to the self invoking function. The program was incorrectly reporting which numbers were odd. Turns out even I fell prey to the complexity.
