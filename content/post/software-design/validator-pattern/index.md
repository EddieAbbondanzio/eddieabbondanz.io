---
title: "Software Design - Validator Pattern"
date: 2018-10-10
type: post
series: "Development"
---

It's quite typical for a Domain Driven Design (DDD) project to need validation for it's domain models. While it may be sufficient to solve this by adding an IsValid() method to each model, this can cause confusion for the developer by cluttering the model class, and/or by requiring the IsValid() method to be generalized that it covers a large range of validation rules for any situation that may arise. Let's work with an example.

Imagine there is an User object like so:

```c#
    public class User {
        public string Username { get; set; }

        public string Password { get; set; }

        public bool IsDeleted { get; set; }

        public User(string username, string password) {
            Username = username;
            Password = password;
        }
    }
```

We need a way that we can validate users before adding them to the database. This could be achieved by adding the IsValid() method as mentioned earlier.

```c#
    public class User {
        ...

        public bool IsValid() {
            if(!string.IsNullOrEmpty(Username) && !string.IsNullOrEmpty(Password)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
```

This solves the problem by checking that both a Username, and Password have been defined, and if not returns false. However, what do we do when we also need to handle validating that a user hasn't been deleted already before allowing it to be deleted? We could add an IsValidToDelete() method to the class but this is just starting to clutter things, and seems like a pretty bad approach. On the other hand we could simply call IsValid before deleting but then any user we want to delete would have to have a valid username, and password which makes no sense.

To overcome this issue we can introduce the concept of validators. Validators utilize the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern) to separate the validaiton logic from the model itself. Let's define an interface for all validators to derive from.

```c#
    public interface IValidator<T> {
        bool Validate(T entity);
    }
```

Now we can define two validators, one to handle users when created, and another to handle users when deleted.

```c#
    public class UserCreationValidator : IValidator<User> {
        public bool Validate(User user) {
            if (!string.IsNullOrEmpty(user.Username) && !string.IsNullOrEmpty(user.Password)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    public class UserDeletionValidator : IValidator<User> {
        public bool Validate(User user) {
            return !user.IsDeleted;
        }
    }
```

Then in our UserController class we could handle validation like so:

```c#
    public class UserController {
        public bool AddUser(User user) {
            UserCreationValidator validator = new UserCreationValidator();

            if (validator.Validate(user)) {
                //Add the user
                return true;
            }
            else {
                return false;
            }
        }

        public bool DeleteUser(User user) {
            UserDeletionValidator validator = new UserDeletionValidator();

            if (validator.Validate(user)) {
                //Delete the user
                return true;
            }
            else {
                return false;
            }
        }
    }
```

This helps maintain the single role principle for each of our classes, and enables us to handle validating based on context in a way that can scale nicely.
