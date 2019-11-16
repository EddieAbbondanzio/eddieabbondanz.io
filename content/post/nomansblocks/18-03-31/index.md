---
title: "No Mans Blocks - 3/31/18"
date: 2018-03-31T15:22:42-04:00
categories: ["NoMansBlocks"]
type: post
---

Stepping back into Networking
---

These past few months I've been on a tangent that wasn't exactly planned. Diving head first into networking code, and attempting to refactor the voxel engine to support it really burnt me out. During this break I've been focusing on the core voxel engine itself. I decided to take the time to really spruce up the voxel engine and add in some much needed features. While I can't exactly remember every change some of the key ones are:

* New Task Scheduler + ThreadManager
* Faster greedy mesh algorithm
* New Command Console
* New World loading method
* Introduction of random world generation
* Prefab Controller to allow for new features such as sprite blocks + more

While it may not seem like much, it will make moving forward much easier. The voxel engine itself is quite enjoyable to work with and I'm excited to see where it goes. I also took the opportunity to redo the server application code. Previously there was a lot of redundant code between the game server and voxel engine, but that's no longer the case. The server app is currently running through console but down the road I plan on adding a GUI.

Below is all of the code for the server. It doesn't really show much as the server application is nothing more than a wrapper for accepting inputs to the command console of Voxelated. I'll give out some more details soon.

```c#
namespace NoMansBlocks.Server {
    /// <summary>
    /// The entry point for the applicaiton. The server app itself
    /// does nothing more than process commands.
    /// </summary>
    public class Program {
        public static void Main(string[] args) {
            VoxelatedEngine.OnStop += OnStop;

            LoggerUtils.SetLogProfile(LogProfile.ConsoleDebug);

            //Start the engine up
            VoxelatedEngine voxelatedEngine = new VoxelatedEngine();
            voxelatedEngine.Start();

            //While it's running, keep accepting commands
            while (voxelatedEngine.IsRunning) {
                string input = Console.ReadLine();
                VoxelatedEngine.Console.Parse(input);
            }
        }

        /// <summary>
        /// Called when the voxelated engine is shutting down.
        /// </summary>
        private static void OnStop(object sender, EventArgs e) {
            Environment.Exit(0);
        }
    }
}


```