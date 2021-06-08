---
title: 'ASP.NET Core - Claims Based Authentication: Claims vs Identities vs Principals'
date: 2019-10-14T14:50:42-04:00
series: 'Development'
type: post
---

With the rise of ASP.NET Core over ASP.NET 4.x, the built in authentication has undergone a shift from role-based access control (RBAC) to claim-based access control (CBAC). The most notable change is the `User` property on `HttpContext` is now of type `ClaimsPrincipal` instead of `IPrincipal`. Before we get to far ahead of ourselves though, lets start with the basics and build our way up.

## Claims

Claims are the foundation behind claims-based authentication (who would have guessed). A claim is simply a piece of information about a subject. A claim does not dictate what a subject can, or cannot do.

> The term "subject" is used because claims are not restricted to only describing users. Claims can be about an application, service, or device.

Some examples of claims a subject may have are:

-   Username
-   Email
-   IP Address
-   Location

Claims are name-key values and are represented via the [`System.Security.Claim`](https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claimsidentity?view=netcore-3.0) class.

```csharp
public class Claim {
  public string Type { get; }
  public string Value { get; }
  public string ValueType { get; }
  // some properties have been omitted.
}
```

Each claim has a `Type` property that is used to identify it, and a `Value` property which holds the data of the claim. For simplicity, `Claim` stores `Value` as a string, but if the data type of `Value` is not a string then the `ValueType` property can be set so the claim consumer knows how to interpret the `Value`.

We could represent a claim for a user's Id as follows:

```csharp
Claim idClaim = new Claim("Id", "1", "Integer");
// idClaim.Name == "Id"
// idClaim.Value = "1"
// idClaim.ValueType == "Integer"
```

Or if we needed one for a user's birthday:

```csharp
Claim dobClaim = new Claim("dob", "04/20/1969", "Date");
// dobClaim.Name == "dob"
// dobClaim.Value == "04/20/1969"
// dobClaim.ValueType == "Date"
```

## Identities

Claims representing the same subject can be grouped together and placed in a [`ClaimsIdentity`](https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claimsidentity?view=netcore-3.0).

```csharp
public class ClaimsIdentity {
  public string Name { get; }
  public IEnumerable<Claim> Claims { get; }
  public string AuthenticationType { get; }
  public bool IsAuthenticated { get; }
  // some properties have been omitted.
}
```

`ClaimsIdentity` also has an `AuthenticationType` property that holds the authentication method used such as "Bearer" or "Basic" and `IsAuthenticated` which returns true as long as `AuthenticationType` is not null.

Imagine we we're working on an API where users are identified via their unique Id, and Name. After validating a bearer token (JWT, etc...) recieved from the user we could create a ClaimsIdentity to represent them:

```csharp
ClaimsIdentity userIdentity = new ClaimsIdentity(
  new Claim[] {
    new Claim("Id", "1"),
    new Claim("Username", "Bert")
  },
  "Bearer"
);

//userIdentity.IsAuthenticated == true since we passed "Bearer" as AuthenticationType.
```

## Principals

A `ClaimsIdentity` is convenient for representing a subject via a collection of claims but what if we want to assign more than one identity to a subject? Returning back to our previous example of the API, what would happen if we wanted to also identify the device being used by the user to ensure it's whitelisted? Sure we could add a new Claim with device IP address, or agent string to the user identity, but what if the user accesses the API from more than one device?

To handle this use case without duplicating user information we'd be best off to create a new identity to represent the device that holds the IP address, and agent string.

```csharp
ClaimsIdentity deviceIdentity = new ClaimsIdentity(
  new Claim[] {
    new Claim("IP", "192.168.1.1"),
    new Claim("Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0")
  }
);

// Note the lack of AuthenticationType
```

Seperating the user claims from the device claims into two seperate identities allows us to indicate that each can exist without the other. This works great, but how do we show that the identies are related? Enter the [`ClaimsPrincipal`](https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claimsprincipal?view=netcore-3.0).

```csharp
public class ClaimsPrincipal {
  public IEnumerable<Claim> Claims { get; }
  public IEnumerable<ClaimsIdentity> { get; }
  public ClaimsIdentity Identity { get; }
  // some properties have been omitted.
}
```

"A principal object represents the security context of the user on whose behalf the code is running, including that user's identity" [\[1\]](https://docs.microsoft.com/en-us/dotnet/api/system.security.principal.iprincipal?view=netcore-3.0). By using a `ClaimsPrincipal` we can group the user identity, and device identity into one context without having to duplicate any info.

```csharp
  var principal = new ClaimsPrincipal(new IIdentity[] { userIdentity, deviceIdentity });
```

`ClaimsPrincipal` provides a handful of helper methods / properties to check things such as if a claim exists (`HasClaim()`) in any of the associated identities. When working within an API controller in ASP.NET we can access the current principal via the `User` property.
