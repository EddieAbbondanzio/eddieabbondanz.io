---
title: "C# Threadable Queue"
date: 2018-05-09T19:04:42-04:00
type: post
categories: ["C#"]
---

Implementing a Thread-Safe Queue
---

One of the most useful data structures when it comes to multi-threading is the queue. However, queues in c# aren't thread-safe by default. Thankfully it's easy enough to implement your own as we will do today. Let's start by defining our class.

```c#
public class ThreadableQueue<T> {

}
```

If your unfamiliar with generics check out this [link.](https://www.dotnetperls.com/generic) Within the class we need to define two members.

```c#
private Queue<T> queue;

privare readonly object lockObj;
```

The queue needs to be kept private so we can control access to it. Anytime it's modified we need to ensure we lock the semaphore object (lockObj) first.

Now lets define two constructors. The second one is optional but provides an easy way to convert a regular queue into a threadable one.

```c#
public ThreadableQueue<T>() {
    queue = new Queue<T>;
    lockObj = new object();
}

public ThreadableQueue<T>(Queue<T> queue){
    this.queue = queue;
    lockObj = new object();
}
```

Next up lets add a way to add, and remove items from the queue. We call lock() around the queue actions as a way to ensure only one thread can access it at once.

```c#
public void Enqueue(T value){
    lock(lockObj){
        queue.Enqueue(value);
    }
}

public T Dequeue(){
    lock(lockObj){
        return queue.Dequeue();
    }
}
```

When it comes to locking you want to call it as little as possible. This is because it can cause performance issues, especially when it's not needed.

Let's wrap things up by adding a few more functions that are expected of any queue.

```c#
public void Clear() {
    lock (lockObj) {
        queue.Clear();
    }
}

public bool Contains(T value){
    lock (lockObj) {
        return queue.Contains(value);
    }
}


public T[] ToArray() {
    lock (lockObj) {
        return queue.ToArray();
    }
}
```

And how can we forget .count?

```c#
public int Count {
    get {
        lock (lockObj) {
            return queue.Count;
        }
    }
}
```

It's easy enough to expand the class if desired. Just ensure your calling lock() first before modifying the underlying queue. 









