---
title: "Software Design - Abstraction"
date: 2018-11-08T17:20:42-04:00
categories: ["Software Design"]
type: post
---

The Less You Know, The Better
---

Do you think the automotive designers who carefully crafted each body line and roll of your car's chassis cared about the engine's cylinder bore or stroke? Or perhaps the firing order, or whether the engine had 2 spark plugs per cylinder akin to Chrysler's hemis?

Of course not, all they cared about were the more important details such as dimensions, mounting positions, electrical connections, and plumbing points. To them, the engine was nothing more than a power plant and they were tasked with creating a chassis that could support it.

Then why should the programmer using your classes have to fully understand the inner-workings of each one in order to fully utilize them? Abstraction promotes simplicity, and elegance that help reduce the overall complexity of code, but only if you actually take advantage of it. 

If a class requires several steps before it can be used, don't write each step as an independent method that needs to be invoked. Instead write *one* initialization method that will take care of all the dirty work for you. You'll thank yourself later when you come back to the program six months down the road and can't remember how to use the class properly. 

Abstraction creates "black boxes" that reduce the number of moving parts you need to have loaded in your mental map of the program at any one time. Instead of worrying about how each one works you can instead focus on connecting each piece of the puzzle to solve the larger problem at hand.

A Working Example
---

Imagine your given the task of creating an online product catalog for the Widget Company. They want to incorporate a search feature to interact with their preexisting back-end so that users visiting the site can find widgets easier. 

The back-end is a little dated and still utilizes SOAP based web services that require an input of XML, and return XML as the output. Thankfully though, the original developers of the back-end planned ahead and prepared a search web service. It expects a properly formatted xml string like so:

```xml
<Params Category="Category">
    Search Text Here
</Params>
```

With some quick thinking you whip up a wrapper function to manage invoking, logging, and parsing the return of the web service.

```c#
public List<Widget> searchWidgets(string xml) {
    //Non-important implementation details
}
```

The function works out perfectly, and allows you to finish building the online widget catalog. The client is happy with the solution, and a couple of months pass by without any issues.

One day though, your boss informs you that the Widget Company has updated their back-end to be RESTful and now has inputs and outputs in JSON. The online catalog no longer works, but it sounds easy enough to fix, right?

It takes a little while to get the dev workspace loaded up due to some small errors like usual, but it does and you start digging in trying to remember why you designed it this way, and where the web services are being invoked.

After fumbling through the code for what feels like an eternity you finally come across your little ingenious solution for invoking the web services.

```c#
public List<Widget> searchWidgets(string xml) {
    //Non-important implementation details
}
```

And then it dawns on you. The function only accepts an input of xml, which is no longer valid input for the new RESTful back-end. You start to panic as your boss only quoted the client 1/2 a day's work, and you already killed 2 hours just setting up the environment. 

Maybe I could refactor the function to accept JSON you think to yourself. A quick *Find All References* in Visual Studio shows the function being invoked over a 100 times. No dice.

With the deadline loaming even closer, you decide to whip up an intermediate function that parses the XML then builds the respective JSON equivalence. It's not pretty, and will probably crash for some edge cases but it works and allows you to restore functionality to the online catalog. Crisis averted.

The Moral Of The Story
---

While it's impossible to plan for everything that may change, and things will change, it is possible to design a system that can be adapted as necessary. Abstraction is simply one of several tools we have at our disposable to help design adaptable systems.

Revisiting the problem from earlier, abstraction could have helped saved us from having to devise a last minute band aid solution, and all the unnecessary stress. A quick refactor of the method to accept a parameter of a category, and search query would suffice. Although it may require some additional work to generate the JSON, this could be offloaded to a helper function to prevent `searchWidgets()` from being overly bloated.

```csharp
public List<Widget> searchWidgets(string category, string query) {
    //Build the JSON here

    //Non-important implementation details
}
```

While too much abstraction can be just as bad as not enough, when used properly it can help keep systems flexible, and simple.