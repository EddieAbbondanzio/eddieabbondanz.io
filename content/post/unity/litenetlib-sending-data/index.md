---
title: "Unity - How to Send Data With LiteNetLib"
date: 2019-11-13T19:04:00-00:00
categories: ["Unity"]
featuredImage: "/post/unity/litenetlib-sending-data/images/hero.jpg"
type: post
---

Continuing off the previous post about [how to build a basic server / client set up with LiteNetLib]({{< ref "/post/unity/litenetlib-basic-server-client" >}}) it's time to talk about sending data. Because, well, a network set up that doesn't actually send any data is kind of useless.

As we already know, we listen for incoming messages from the network via an `IEventListener` that we pass to our `NetManager`. `IEventListener` contains an event called `NetworkReceiveEvent` which is triggered anytime the network receives data from another connection. (If we were a server this would be one of the clients sending us something.)

In the `NetworkReceiveEvent` delegate we're given a few parameters. The `NetPeer` that the message came from, a `NetDataReader` for reading the incoming data, and the `DeliveryMethod` of how it was sent (see [LiteNetLib's Delivery Methods]({{< ref "/post/unity/litenetlib-delivery-methods" >}})).

```c#
public void HandleNetworkRecieveEvent(NetPeer sender, NetDataReader data, DeliveryMethod deliveryMethod) {

}
```

`NetDataReader` provides us with a lot of great helpers to interpret the data received, such as `GetByte()`, `GetInt()`, or even `GetStringArray()` but what do we do if we don't know what kind of data was sent?

One option would be to ensure our data is always sent with a type flag as the first byte which we could then use to recreate the original object but then our handler would grow linearly as the number of packet types increases.

```c#
public void HandleNetworkRecieveEvent(NetPeer sender, NetDataReader data, DeliveryMethod deliveryMethod) {
    PacketType = (PacketType)data.PeekByte()

    switch(PacketType) {
        case PacketType.Foo
        ...
        case PacketType.Bar
        ...
        case PacketType.Baz
        ...
        case PacketType.Cat
        ...
        case PacketType.Dog
        ...

        // And so on...
    }
}
```

# Enter the `NetPacketProcessor`

On the other hand, we could offload some of this logic to the `NetPacketProcessor` and leave it up to the processor to rebuild our incoming data. This convenience does come with a price though. The `NetPacketProcessor` will add 64 bits (8 bytes) to the beginning of each message we send. There's no doubt that there are some situations where every bit matters and this may be a deal breaker, but for most applications it's a reasonable price to pay.

Let's define a packet that we want to send over the network.

```c#
public class FooPacket {
    public int NumberValue { get; set; }
    public string StringValue { get; set; }
}
```

{{% alert type="info" %}}
[`Client.cs`](https://gist.github.com/EddieAbbondanzio/81eb3675f8cb8b51acbdc8888f9ab1a3#file-client-cs) and [`Server.cs`](https://gist.github.com/EddieAbbondanzio/81eb3675f8cb8b51acbdc8888f9ab1a3#file-server-cs) from the previous section will be reused to reduce redundancy.
{{%/ alert %}}

First up, we're going to modify the server to send a `FooPacket` to the newly connected client in `PeerConnectedEvent`. To do this we'll need to add a `NetPacketProcessor` as a field on the server.

```c#
public class Server : MonoBehaviour {
    EventBasedNetListener netListener;
    NetManager netManager;
    NetPacketProcessor netProcessor; // Add this

    // Start is called before the first frame update
    void Start() {
        netListener = new EventBasedNetListener();
        netManager = new NetManager(netListener);
        netProcessor = new NetPacketProcessor(); // Don't forget to initialize it

        netManager.Start(9050);

        netListener.ConnectionRequestEvent += (request) => {
            request.Accept();
        };

        netListener.PeerConnectedEvent += (client) => {
            Debug.LogError($"Client connected: {client}");
        };
    }

    // Update is called once per frame
    void Update() {
        netManager.PollEvents();
    }
}
```

Then in the `PeerConnectedEvent` delegate we'll add a new call to `NetPacketProcessor.Send()`.

```c#
netListener.PeerConnectedEvent += (client) => {
    Debug.LogError($"Client connected: {client}");

    netProcessor.Send(client, new FooPacket() { NumberValue = 1, StringValue = "Test" }, DeliveryMethod.ReliableOrdered);
};
```

If we wanted to send a `FooPacket` to every client connected to the server when a new client connects we could achieve this by using the following line instead:

```c#
netManager.SendToAll(netProcessor.Write(new FooPacket() { NumberValue = 3, StringValue = "Cat"}), DeliveryMethod.ReliableOrdered);
```

With the server set up to send a `FooPacket` to the client upon successful connection, we need to update the client to listen for the `FooPacket`. We'll do this by adding a `NetPacketProcessor` field to the `Client`.

```c#
public class Client : MonoBehaviour {
    EventBasedNetListener netListener;
    NetManager netManager;
    NetPacketProcessor netPacketProcessor; // New field

    void Start() {
        netListener = new EventBasedNetListener();
        netPacketProcessor = new NetPacketProcessor(); // Same thing to initalize as the server

        netListener.PeerConnectedEvent += (server) => {
            Debug.LogError($"Connected to server: {server}");
        };

        netManager = new NetManager(netListener);
        netManager.Start();
        netManager.Connect("localhost", 9050);
    }

    // Update is called once per frame
    void Update() {
        netManager.PollEvents();
    }
}
```

Then we'll set it up so the packet processor reads all incoming data. Put this in `Start()` with the other initialization logic.

```c#
netListener.NetworkReceiveEvent += (server, reader, deliveryMethod) => {
    netPacketProcessor.ReadAllPackets(reader, server);
};
```

And lastly, we need to tell the packet processor to notify us when a `FooPacket` comes in. This will also be done in `Start()`.

```c#
netPacketProcessor.SubscribeReusable<FooPacket>((packet) => {
    Debug.Log("Got a foo packet!");
    Debug.Log(packet.NumberValue);
});
```

Running the server and client we can see that the `FooPacket` is sent to the client from the server and contains the correct `NumberValue` of 1.

![](images/1.png)

# Limitations

As noted by the [wiki page](<https://github.com/RevenantX/LiteNetLib/wiki/NetPacketProcessor-(NetSerializer)-usage>) the `NetPacketProcessor` has several limitations.

## Properties must have public getters / setters or classes / structs implement `INetSerializable`.

```c#
// Bad!
public class BarPacket {
    public string Key { get; private set; }
}

// Good
public class BarPacket : INetSerializable {
    public string Key { get; private set; }

    public void Serialize(NetDataWriter writer) {
        writer.Put(Key);
    }

    public void Deserialize(NetDataReader reader) {
        Key = reader.GetString();
    }
}
```

## Nested types are not supported. The following types for properties are supported:

```
byte sbyte short ushort int uint long ulong float double bool string char IPEndPoint
byte[] short[] ushort[] int[] uint[] long[] ulong[] float[] double[] bool[] string[]
```

However, there are two workarounds. The first option is to register the nested type with a static `Serialize` and `Deserialize` method to parse them. This is useful for types that we do not have control over such as `Vector3` in Unity.

```c#
public class FakePacket {
    public Vector3 Position { get; set; }
}

public class Vector3Utils {
    public static void Serialize(NetDataWriter writer, Vector3 vector) {
        writer.Put(vector.x);
        writer.Put(vector.y);
        writer.Put(vector.z);
    }

    public static Vector3 Deserialize(NetDataReader reader) {
        return new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
    }
}

netPacketProcessor = new NetPacketProcessor();
netPacketProcessor.RegisterNestedType(Vector3Utils.Serialize, Vector3Utils.Deserialize);
```

The second option is for the nested type to implement `INetSerializable`. This is the better choice to use when we have control over the type definition.

```c#
public class CatPacket {
    public Cat Cat { get; set; }
}

public class Cat : INetSerializable {
    public string Name { get; set; }
    public int Age { get; set; }

    public void Serialize(NetDataWriter writer) {
        writer.Put(Name);
        writer.Put(Age);
    }

    public void Deserialize(NetDataReader reader) {
        Name = reader.GetString();
        Age = reader.GetInt();
    }
}

netPacketProcessor = new NetPacketProcessor();
netPacketProcessor.RegisterNestedType<Cat>(() => new Cat()); // We need to pass the constructor when it's not a struct.
```

# Source Code

{{< gist EddieAbbondanzio 0344b09faaadf5b6adea3ec91c7efebf >}}
