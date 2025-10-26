---
title: "TypeScript - Events"
date: 2019-01-21
type: post
thumbnail: "/post/typescript/events/images/1.jpg"
categories: "Development"
---

If you were expecting a phone call from a friend, you (hopefully) wouldn't sit by the phone and continuously pick it up to see if your friend was on the other end. Instead, you'd wait to be notified of an incoming call when the phone started ringing or vibrating. Sitting by the phone and picking it up over and over again is a form of what's known as polling.

Polling in Computer Science is "the process where the computer or controlling device waits for an external device to check for its readiness or state." [1] It's often used for low level applications such as listening for incoming data from the network, or interacting with an IO device.

We could represent a very basic form of polling from a network as follows:

```ts
while (true) {
  if (network.hasData()) {
    //Do work
  }
}
```

Since the network doesn't "announce" when data comes in, we have to manually check it over and over again via the `network.hasData()` conditional. Polling can be a costly operation depending on how often it occurs, and should only be used when there are no other options. Fortunately, for most problems we can take advantage of events to write reactive code that only executes when needed.

# Enter TypeScript

TypeScript may not support events directly out of the box, but that doesn't mean we can't create our own. We'll start off by defining a type to represent event handlers that can subscribe to events.

```ts
/**
 * Event handler that can subscribe to a dispatcher.
 */
export type EventHandler<E> = (event: E) => void;
```

Now let's define an interface to represent events. By defining an interface we can restrict the ability to invoke events to within the class that owns them.

```js
/**
 * Event that can be subscribed to.
 */
export interface Event<E> {
  /**
   * Register a new handler with the dispatcher. Any time the event is
   * dispatched, the handler will be notified.
   * @param handler The handler to register.
   */
  register(handler: EventHandler<E>): void;

  /**
   * Desubscribe a handler from the dispatcher.
   * @param handler The handler to remove.
   */
  unregister(handler: EventHandler<E>): void;
}
```

After that we'll need an event dispatcher. This will need to implement our `Event<E>` interface.

```js
/**
 * Dispatcher that can propogate events to subscribers.
 */
export class EventDispatcher<E> implements Event<E> {}
```

The dispatcher maintains a collection of handlers that should be notified anytime the event is dispatched.

```js
export class EventDispatcher<E> implements Event<E> {
    /**
     * The handlers that want to be notified when an event occurs.
     */
    private _handlers: EventHandler<E>[];

    /**
     * Create a new event dispatcher.
     */
    constructor() {
        this._handlers = [];
    }
}
```

Then to satisfy the `Event<E>` interface we'll implement `register()` and `unregister()` like so:

```js
    /**
     * Register a new handler with the dispatcher. Any time the event is
     * dispatched, the handler will be notified.
     * @param handler The handler to register.
     */
    public register(handler: EventHandler<E>): void {
        this._handlers.push(handler);
    }

    /**
     * Desubscribe a handler from the dispatcher.
     * @param handler The handler to remove.
     */
    public unregister(handler: EventHandler<E>): void {
        for (let i = 0; i < this._handlers.length; i++) {
            if (this._handlers[i] === handler) {
                this._handlers.splice(i, 1);
            }
        }
    }
```

To finish off our `EventDispatcher<E>` class, we'll define a `dispatch()` method that can notify all the subscribers when the event is invoked.

```js
    /**
     * Dispatch an event to all the subscribers.
     * @param event The data of the event that occured.
     */
    public dispatch(event: E): void {
        for (let handler of this._handlers) {
            handler(event);
        }
    }
```

# Example

Imagine we we're working on a login form that accepts an input of an email, and password. The form needs to notify the parent page when the user hits the login button so a request can be sent off to the server.

```js
    export type UserCredentials = { email: string, password: string };

    export class LoginForm {
        private _email!: string;

        private _password! string;

        private _onLoginDispatcher: EventDispatcher<UserCredentials>;

        get onLogin(): Event<UserCredentials> {
            return this._onLoginDispatcher as Event<UserCredentials>;
        }
    }
```

By making use of a getter property to publicize `onLogin` we prevent the chance of any external sources from invoking the `dispatch()` property on the event dispatcher. This helps create a similar set up to how C# restricts events to be invoked only within the class their defined. And lastly to invoke our event we would do the following:

```js
this._onLoginDispatcher.dispatch({
  email: "john.smith@mail.com",
  password: "hunter2",
});
```

## Sources

[1] Wikipedia contributors. (2018, June 3). Polling (computer science). In Wikipedia, The Free Encyclopedia. Retrieved 12:12, January 22, 2019, from https://en.wikipedia.org/w/index.php?title=Polling_(computer_science)&oldid=844171740

## Photo

[By Lance Anderson](https://unsplash.com/photos/yV-an6f_rqo)
