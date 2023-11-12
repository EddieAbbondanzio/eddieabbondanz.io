---
title: "Software Design - Dependency Injection and Inversion"
date: 2018-10-18T06:34:42-04:00
type: post
series: "Development"
---

## What are they?

While it may seem like nothing more than buzz words, dependency injection is a well known principle. In fact, you've likely used it yourself in the past and just didn't know the technique had a name. Dependency injection can be thought of as passing a resource required by a class to the class through one of several means. While the class could instantiate a new instance of the resource itself, by using dependency injection we introduce an easier way to take advantage of dependency inversion.

Dependency inversion sounds similar but is a slightly different principle. In simple terms, dependency inversion prevents high level modules from relying upon low level modules through the use of an abstraction. This inverts the dependency such that the higher level class no longer relies upon a concrete implementation, and can utilize any resource that complies with the dependency contract defined through the abstraction.

Dependency injection comes in three different flavors:

- Constructor injection
- Method injection
- Property injection

## Constructor injection

Constructor injection is where the dependency is passed to the dependent class directly through it's constructor. This method should be used when the dependent is reliant upon the dependency in such a way that the dependent cannot function without it.

## Method / Property injection

Since these two are similar in nature we'll combine them. Method injection is when the dependency is passed to the dependent class via a method. Property injection on the other hand, is where the dependency is injected via a setter property on the dependent. These should be used when a class has a dependency but isn't fully reliant upon it. The dependent class should be able to still function in some manner without it.

## A Working Example

Imagine we are designing an `EmailInbox` that needs to be able to send and receive emails. The `EmailInbox` will depend on an `EmailService` for communicating with the network.

```csharp
    public class EmailService {
        public List<Email> CheckForEmails() {
            //Non-important implementation...
        }

        public void SendEmail(Email email){
            //Blah blah blah
        }
    }
```

Since an `EmailInbox` would be pretty useless without the `EmailService`, we could argue this would be a good use of constructor injection.

```csharp
    public class EmailInbox {
        private EmailService EmailService { get; set; }

        public EmailInbox(EmailService emailService) {
            this.EmailService = emailService;
        }
    }
```

This works decently, but our `EmailInbox` is restricted to a single email service. What if we want to expand it's compatibility to support other email services? For this, we could take advantage of dependency inversion. The first step would be to define our dependencies contract via an interface.

```csharp
    public interface IEmailService {
        List<Email> CheckForEmails();

        void SendEmail(Email email);
    }
```

Now we need to update our `EmailInbox` to rely on interface references.

```csharp
    public class EmailInbox {
        private IEmailService EmailService { get; set; }

        public EmailInbox(IEmailService emailService) {
            this.EmailService = emailService;
        }
    }
```

And just like that we have utilized dependency inversion to no longer be reliant upon the lower level module (`EmailService`). Now the `EmailInbox` can be created with any `EmailService` that can implements the interface `IEmailService`.

```csharp
    public class GmailEmailService : IEmailService {
        ...
    }

    public class HotmailEmailService : IEmailService {
        ...
    }

    //Create a new Gmail based inbox.
    IEmailService gmailService = new GmailEmailService();
    EmailInbox gmailInbox = new EmailInbox(gmailService);

    //Create a new Hotmail based inbox.
    IEmailService hotmailService = new HotmailEmailService();
    EmailInbox hotmailInbox = new EmailInbox(hotmailService);
```

These two concepts can be easy to confuse since they share such similar names, and are used together. Hopefully this article helped clarify them.
