---
title: "No Mans Blocks - 4/8/18"
date: 2018-04-08
type: post
series: "Development"
---

## Building Up the Network Logic

While this week may not have much to show for it has built a solid foundation for networking. I spent some time refactoring the pre-existing network logic to try to clean things up. I really didn't like how the NetServerManager and NetClientManager derived from a base class of NetManager that had a NetMessageProcessor component. It was gross having to call that and subscribe to it's message events. I also didn't care for how each message had it's own event. To try to curtail this redundancy I came up with the following solution.

This networking set up is built on top of the Lidgren networking library. I wanted to abstract away from the Lidgren aspect since it's kinda low level, but I didn't want to go over the top at the same time. I based my setup from this [site's](https://dirkkok.wordpress.com/2012/02/20/lets-make-a-multiplayer-game-part-1/) tutorial and applied a few custom tweaks to it.

To reduce redundant code and prevent potential logic errors from arising I changed NetMessage to an abstract class, and added a message category to the class. Now instead of requiring an unique event for each message type I only had to add one per category. Since most components of the game would require several messages it made sense to group them together instead of having to track multiple events per component.

The NetManager base class is responsible for checking and sending out message over the network. It allows for the server and client to be abstract away from the regular game logic as well. Below is the method for checking for messages.

```c#
/// <summary>
/// Check to see if any messages have come in from the network.
/// </summary>
public void CheckForMessages() {
    NetIncomingMessage inMsg;

    while((inMsg = ReadMessage()) != null) {
        NetMessage recievedMsg = NetMessage.DecodeMessage(inMsg);

        //Sometimes we don't actually have a network message to process.
        if(recievedMsg == null) {
            continue;
        }

        switch (recievedMsg.Category) {
            case NetMessageCategory.Connection:
                if(OnConnectionMessage != null) {
                    OnConnectionMessage(this, new NetMessageArgs(recievedMsg));
                }
                break;

            case NetMessageCategory.Info:
                if(OnInfoMessage != null) {
                    OnInfoMessage(this, new NetMessageArgs(recievedMsg));
                }
                break;

            case NetMessageCategory.Lobby:
                if(OnLobbyMessage != null) {
                    OnLobbyMessage(this, new NetMessageArgs(recievedMsg));
                }
                break;
        }

        Recycle(inMsg);
    }
}
```

As each category is added this will be expanded upon but I can't see there being too many categories. By the end of this coming week I should have all lobby data synced along with a working chat system. This may seem fairly basic, and it really is because most of the magic is occuring in NetMessage.DecodeMessage(). DecodeMessage is similar to the factory pattern as it is responsible for creating every message recieved over the net.

```c#
/// <summary>
/// Decode a message that was recieved from over the network.
/// </summary>
public static NetMessage DecodeMessage(NetIncomingMessage inMsg) {
    switch (inMsg.MessageType) {
        case NetIncomingMessageType.VerboseDebugMessage:
        case NetIncomingMessageType.DebugMessage:
        case NetIncomingMessageType.WarningMessage:
        case NetIncomingMessageType.ErrorMessage:
            return new InfoMessage(inMsg);

        case NetIncomingMessageType.ConnectionApproval:
        case NetIncomingMessageType.StatusChanged:
            return DecodeConnectionMessage(inMsg);

        case NetIncomingMessageType.Data:
        case NetIncomingMessageType.UnconnectedData:
            return DecodeDataMessage(inMsg);

        default:
            return null;
    }
}
```

It takes an input of NetIncomingMessage (lidgren's message class) and converts them into the new custom message that is specialized. Info messages are nothing more than a string so they can be returned instantly. Things get a bit trickier with connection messages, and data messages though.

```c#
/// <summary>
/// Decodes a connection message such as connection request, connect,
/// or disconnect that was recieved from over the network.
/// </summary>
private static NetMessage DecodeConnectionMessage(NetIncomingMessage inMsg) {
    if (inMsg == null) {
        return null;
    }

    NetMessage connMsg = null;

    //New client wants to connect
    if (inMsg.MessageType == NetIncomingMessageType.ConnectionApproval) {
        connMsg = new ConnectionRequestMessage(inMsg);
    }
    //Client has fully connected, or wants to disconnect
    else if (inMsg.MessageType == NetIncomingMessageType.StatusChanged) {
        NetConnectionStatus senderStatus = inMsg.SenderConnection.Status;

        //Fully connected new client
        if (senderStatus == NetConnectionStatus.Connected) {
            connMsg = new ConnectMessage(inMsg);
        }
        //Old client leaving
        else if (senderStatus == NetConnectionStatus.Disconnected) {
            connMsg = new DisconnectMessage(inMsg);
        }
    }

    return connMsg;
}
```

This method handles a few different tasks. It's responsible for processing ConnectionRequest, Connected, and Disconnect messages. A ConnectionRequestMessage occurs when a new client wants to join the server. This allows the server to get the player's desired name, and check if they are a known banned connection. Connection messages are nothing more than an acknowledgement that the client has joined in, but perhaps in the future they'll have some data attached to them. A Disconnect message is also nothing more than a courtesy to server instead of having the client time out.

Rebuilding data messages is simpler. It's nothing more than a switch statement that reads the first byte of each message to get the NetMessageType.

```c#
/// <summary>
/// Decodes a custom data message that was recieved from over the network.
/// </summary>
private static NetMessage DecodeDataMessage(NetIncomingMessage inMsg) {
    NetMessageType msgType = (NetMessageType)inMsg.ReadByte();

    switch (msgType) {
        case NetMessageType.Chat:
            return new NetChatMessage(inMsg);

        case NetMessageType.Command:
            return new CommandMessage(inMsg);

        case NetMessageType.LobbySync:
            return new LobbySyncMessage(inMsg);

        case NetMessageType.PlayerJoined:
            return new PlayerJoinedMessage(inMsg);

        case NetMessageType.PlayerLeft:
            return new PlayerLeftMessage(inMsg);

        default:
            return null;
    }
}
```

In the near future once the network is solidified I plan on writing up a nice networking tutorial with Lidgren and Unity to help out others.
