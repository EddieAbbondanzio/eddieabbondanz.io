---
title: "C++ - Introduction and Hello World"
date: 2019-05-12T13:22:42-04:00
categories: ["C++"]
type: post
---

I've been wanting to dive into C++ for some time now, and figure it's finally time to bite the bullet. I'm already familiar with several other languages (C#, JavaScript, and TypeScript) but none of these are low level like C++. My plan for this journey is to learn in public and share everything I learn via a series of blog posts. 

To keep things concise, I won't be covering the basics of programming so this series will assume the reader already has some experience under their belt. Lastly, my laptop is running Kubuntu so the series will be directed towards other Linux users, but those using Windows, or OSX should still be able to follow along. Enough rambling let's get started.

C++ is a compiled language which means we'll need to install a compiler that can convert our source files into an executable that the computer can understand. We can accomplish this by installing the `build-essential` package which includes both the GNU C compiler, and GNU C++ compiler.

```bash
sudo apt-get install build-essential
```

We can check to ensure both compilers installed successfully using the following commands. Each commands will print out a blurb of information containing the version and more of each compiler respectively.

```bash
gcc -v
g++ -v
```
 With a compiler installed we can create our first program. As is tradition we'll use the classic hello world. Go ahead and create a new file named `program.cpp`. Then open up the file and enter the following:

```c++
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}
```

Let's break it down line by line. In the first line we are using the preprocessor directive `#include` to import the iostream library which gives us useful functions such as `cout` (`Console.Write()` in C#). When programs are compiled, the compiler attempts to include the bare minimum to help reduce bloat and keep the size of the executable small. By using the `#include` preprocessor directive we are telling the compiler to include the iostream library in our executable. If we we're to omit the `#include` then the compiler would throw an error claiming the function `cout` has not yet been defined.

In the next line we are letting the compiler know that we will be using functions from the `std` namespace which is a part of iostream. This is similar to the `using` declaration in C# and lets us skip having to write out the fully qualified function name each time we invoke one. Consider the following code blocks. Both behave identically and print out the message "Hello World!".

```c++
//Using a namespace
using namespace std;
cout << "Hello World!";
```

```c++
//Without using a namespace.
std::cout << "Hello World!";

```

Moving down to `int main()` we've now reached the meat of the program. In this line we're defining a function called `main` that returns an integer. All C++ programs begin execution in `main()`, and the integer return value represents if the program completed successfully (0) or errored (!0).

Inside the main function we're calling the `cout` function that prints the string we pass to the console. `cout <<` may look a little odd but we can think of it as `cout()`. `<<` is the stream out operator and is being used to pass our string to `cout`.

With our hello world program ready to go we're ready to compile it. Open up a terminal window in the parent directory holding our program and compile it via the following command

```bash
g++ -o program.out program.cpp
```

This command will build our program and output the executable to `program.out`. Once compiled we can now run our program using `./program.out`

Your terminal window should print out the classic hello world message:

```bash
eddie@LG-Microwave:/media/eddie/Extra Space/Development/Projects/c++/hello-world$ ./program.out
Hello World!
```

Congratulations! You've just wrote your first C++ program. In the next post I'll be going over how to set up VS Code to be a C++ development environment.