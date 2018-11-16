---
title: "Software Design - Magic Numbers"
date: 2018-10-29T19:16:42-04:00
categories: ["Software Design"]
type: post
---

What Are They?
===

Magic numbers are numbers in code that appear to be arbitrary, but actually serve a purpose. They are commonly described as an anti-pattern as they diminish code quality, and are "referred to as breaking one of the oldest rules of programming, dating back to the COBOL, FORTRAN and PL/1 manuals of the 1960s". [1]

However, this does not mean that all constants should be blindly replaced with pre-defined constants. A good rule of thumb to follow when deciding if a number should be changed to a constant is if the number is a well known value (number of hours in a day, etc...),compared to a lesser known value (the average air velocity of a laiden swallow). If the number is not well known, then it should be changed to a constant with a comment explaining it.

Example
===

Imagine you're designing a user system for a web site. To help enforce better security practices, you've decided there will be a minimum password length of at least 7 characters. To achieve this we could define a `User` class like so:

```c#
public class User {
    private string password;

    public string Password {
        get { return password; }
        set {
            if(value.length < 7) {
                throw new InvalidArgumentException("Password is too short");
            }

            password = value;
        }
    }
}
```

This satisfies our security requirement, but what if instead of catching exceptions when attempting to set a password we want to take advantage of the 
[validator pattern]( {{< relref "validator-pattern" >}})? An improper solution to would be to define a `PasswordValidator` as:

```c#
public class PasswordValidator {
    public bool Validate(string password) {
        return password.length >= 7;
    }
}
```

Why is this bad? Because it violates the DRY (don't repeat yourself) principle. We now have two locations that maintain a minimum password length. In larger projects when a single magic number is used in more than 1 places it can turn into a nightmare hunting down all the instances if the magic number ever needs to be changed.

We could refactor the example above to be more maintainable by introducing a `MinPasswordLength` constant for the `User` class.

```c#
public class User {
    public const int MinPasswordLength = 7;

    private string password;

    public string Password {
        get { return password; }
        set {
            if(value.length < User.MinPasswordLength) {
                throw new InvalidArgumentException("Password is too short");
            }

            password = value;
        }
    }
}

public class PasswordValidator {
    public bool Validate(string password) {
        return password.length >= User.MinPasswordLength;
    }
}
```

Constants are your friend and should be used whenever (reasonably) possible.

Sources
===

1. Martin, Robert C. (2009). "Chapter 17: Smells and Heuristics - G25 Replace Magic Numbers with Named Constants". Clean Code - A handbook of agile software craftsmanship. Boston: Prentice Hall. p. 300. ISBN 0-13-235088-2.