---
title: "Software Design - Marker Interfaces"
date: 2018-11-02T05:12:42-04:00
categories: ["Software Design"]
type: post
---

What Are They?
===

A marker interface is an empty interface (no methods or properties) that is used to identify classes that implement it belong to a special group. Some might argue that this is a code smell, but in certain situations they can be the best solution for constraining types. 

It should be noted that the purpose of marker interfaces is a perfect job for the decorator pattern. However, in some languages (C# for example) attributes lack the support we need to implement a quick solution. For now, in order to keep things simple it seems best to stick with marker interfaces.

Example
===

Your tasked with writing a `ServiceLocator` that will be used to register, and retrieve various business logic services for a web server.

```c#
public class ServiceLocator {
    public void Register<???>() {
        //Implementation details...
    }

    public ??? Retrieve<???>() {
        //Implementation details...
    }
}
```

While we could create a `ServiceAttribute` to indicate which classes are services, this would require additional work and the use of reflection to determine which classes have the attribute at runtime. This is unnecessary overhead that could introduce bugs, and will take longer to develop.  

On the other hand we could leave the `ServiceLocator` wide open and allow any object to be registered and retrieved, but this could lead to abuse, and doesn't feel quite right. This is where marker interfaces can be taken advantage of.

Our marker interface would look like so:

```c#
//The marker interface
public interface IService { 

}
```

Now we can update the generic type on the `ServiceLocator` as such:

```c#
public class ServiceLocator {
    public void Register<IService>() {
        //Implementation details...
    }

    public IService Retrieve<IService>() {
        //Implementation details...
    }
}
```

Using marker interfaces may not be the best approach in every language, but in certain situations it satisfies the need for a quick, and elegant solution.