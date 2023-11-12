---
title: "No Mans Blocks - 6/4/18"
date: 2018-06-04T20:05:42-04:00
type: post
series: "Development"
---

## Creating Time (literally!)

I have a knack for forgetting what I've managed to accomplish on the game during the week. To try to overcome this
so I have updates I can post on it, I've started writing down each accomplishment on a sticky note.

Every Friday I hope to write a small blurb, and post some code showing off the current state of No Mans Blocks. While
the networking implementation is still early, I've managed to get a sever-authoratative set up running that handles
syncing up lobby of players together. Players can specify their own nicknames, which will be ensured to be unique. Chat with
each other through text based messages, and some moderator functions such as kicking players are included.

Changelog:

- Switched to LiteNetLib from Lidgren. (Very happy).
- Added custom kick message that is sent to players when kicked from a lobby.
- Changed lobby settings to allow for picking of the next map via voting
  or randomly.
- Fixed a bug in the byte buffer that was writing a bool as a byte instead of just a bit.
- Moved Name + description of the server to server settings instead of lobby. (The client
  recieves these when their connection is accepted.)
- Added game modes (Team Deathmatch, Deathmatch, Capture the Flag, and Demolition) more on these soon...

Lastly while the switch to LiteNetLib was pretty hassle free I did have to implement my own
network synchronized time system, which is actually quite a bit easier than it sounds!

Both the server, and clients maintain their own time which basically just indicates how long the
game has been running for in seconds. To generate a synchronized time across the
network the following steps need to be taken.

1. When a client connects have them send a time sync request and track when it was sent

- The server then responds back with it's current time.
- On the return of the sync request to the client calculate the offset from server time to
  local time by subtracting the round trip time from the recieved value.

These code snippets are from my TimeSynchronizer class. They are the message handlers that
process incoming messages from over the network.

```c#
private void OnConnectionMessage(object sender, NetMessageArgs e) {
    switch (e.Message?.Type) {
        //Step 1 (Client side):
        //When a new server is connected to. Send it a time request.
        case NetMessageType.ConnectionAccepted:
            SendSyncRequest();
            break;

        //Disconnected from server. Wipe offset.
        case NetMessageType.Disconnected:
            time.SetServerOffset(0);
            break;
    }
}

private void OnTimeMessage(object sender, NetMessageArgs e) {
    switch (e.Message?.Type) {
        //Step 3 (Client Side)
        //Time sync message was recieved.
        case NetMessageType.TimeSync:
            TimeSyncMessage incomingSync = e.Message as TimeSyncMessage;

            if (incomingSync != null) {
                time.SetServerOffset(incomingSync.ServerTime - timeSyncSentAt);
            }

            break;

        //Step 2 (Server Side)
        //Client is requesting a time sync message.
        case NetMessageType.TimeSyncRequest:
            LiteNetLib.NetPeer msgSender = e.Message.Sender;
            if (msgSender != null) {
                TimeSyncMessage outgoingSync = new TimeSyncMessage(Time.LocalTime);
                netManager.SendMessage(outgoingSync, msgSender, LiteNetLib.SendOptions.ReliableOrdered);
            }
            break;
    }
}
```

This process isn't quite perfect and a variance of several milliseconds can occur but this can be overcome by repeating these steps occasionally. It could be
taken one step further and several time syncs could be sent when a player first joins, then the average offset can be calculated from them which can reduce bad
data due to a lag spike.
