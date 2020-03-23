---
title: "Logging to Unity or Console"
date: 2018-03-31T15:56:01-04:00
category: "Unity"
type: post
---

## Sometimes we want code that can run outside of Unity

And that can make things tricky when it comes to writing text to console. Unity has it's own set of methods for writing to it's command console via the Debug class with the most commonly used one being Debug.Log(). However in the event you want to create a library of code that can be run within Unity or in the command console (say a game server for example) you'll need a way to differentiate between the running environments. Instead of wrapping all our Debug.Log() calls in preprocessor directives such as #IF UNITY_EDITOR we can write a simple logging class to handle it for us. While we're at it well add the ability to write log files since they can be quite useful.

Before we go ahead and dive into creating the new logger we'll need to add a few helpers first.

```c#
public enum LogLevel : byte {
    None = 0,
    Normal = 1,
    Verbose = 2
}

public enum LogOutput : byte {
    Unity = 0,
    Console = 1,
    FileOnly = 2
}
```

The LogLevel lets us control what log messages are displayed. Say for example you want to run in a minimal logging mode, by setting the log level to normal, it would hide
any message that has a level of verbose from being displayed. Verbose messages would still be written to the log file however.

LogOuput is just an easy way to track if we should be using Debug.Log() or Console.WriteLine(). Lastly lets go ahead and define a struct for storing all of the log settings. This will allow us to store 'profiles' of how the logger should behave.

```c#
/// <summary>
/// Contains info regarding how the Logger
/// should operate. Contains some predefined
/// profiles to simplify the process.
/// </summary>
public struct LogProfile {

    /// <summary>
    /// Allows for different levels of log statements
    /// to be picked. If verbose, then every log statement
    /// is printed.
    /// </summary>
    public LogLevel Level { get; set; }

    /// <summary>
    /// What method should be used for outputting
    /// log statements.
    /// </summary>
    public LogOutput Output { get; set; }

    /// <summary>
    /// If the log history should be saved to file when
    /// the application closes.
    /// </summary>
    public bool SaveToFile { get; set; }
    #endregion

    #region Constructor(s)
    /// <summary>
    /// Create a new log profile that doesn't
    /// save to file.
    /// </summary>
    public LogProfile(LogLevel level, LogOutput output) {
        Level = level;
        Output = output;
        SaveToFile = false;
    }

    /// <summary>
    /// Create a new log profile that can save to file.
    /// </summary>
    public LogProfile(LogLevel level, LogOutput output, bool saveFile) {
        Level = level;
        Output = output;
        SaveToFile = saveFile;
    }
}
```

Then we can define some static instances as such:

```c#
/// <summary>
/// The default logging profile for when running in unity debug.
/// </summary>
public static readonly LogProfile UnityDebug = new LogProfile(LogLevel.Verbose, LogOutput.Unity);

/// <summary>
/// Used for debugging the server.
/// </summary>
public static readonly LogProfile ConsoleDebug = new LogProfile(LogLevel.Verbose, LogOutput.Console);

/// <summary>
/// Used for release builds.
/// </summary>
public static readonly LogProfile Release = new LogProfile(LogLevel.None, LogOutput.FileOnly, true);
```

Now Let's go ahead and define our new logging class. You'll want this to be static to prevent needing a reference to an instance of it.

```c#
/// <summary>
/// Logger utility for logging custom error or log messages to
/// console and file.
/// </summary>
public static class LoggerUtils {


}
```

We'll want to create a few settings for the file writer to follow. The directory name doesn't matter, and the max count can be whatever. We just don't want to fill the users storage space with thousands of log files.

```c#
/// <summary>
/// The file extension to use for log files.
/// </summary>
private const string LogFileExtension = "txt";

/// <summary>
/// The folder to save logs in.
/// </summary>
private const string LogFileDirectory = "VoxLogs";

/// <summary>
/// The max number of log files allowed in the folder
/// at one time.
/// </summary>
private const int MaxLogCount = 8;
```

Now lets add a list to track all the messages that have been logged. Along with a profile for the settings

```c#
/// <summary>
/// The collection of log messages to store.
/// </summary>
public static List<string> Messages { get; private set; }

/// <summary>
/// Controls how the logger operates.
/// </summary>
private static LogProfile profile;
```

Let's add a static constructor to initialize the local variables. This will default the Logger to release mode. I'll explain what the destructor is in a minute.

```c#
static LoggerUtils() {
    profile = LogProfile.Release;

    Messages = new List<string>();
    destructor = new Destructor();
}
```

Add in some public methods. One to allow setting of the log profile, and several for logging statements. Feel free to change them to your liking as these are just provided as basic examples. The switch statment checks to see where logging should be outputted to. If LogOutput is set to none, nothing will be printed but the message will be saved in the list. I didn't apply the log level to the error method as in my opinion, an error shouldn't be hidden.

```c#
/// <summary>
/// Set what profile the logger should follow.
/// </summary>
public static void SetLogProfile(LogProfile logProfile) {
    profile = logProfile;
}

/// <summary>
/// Log an error to console and to the log file.
/// </summary>
public static void LogError(string message) {
    string fullError = DateTime.Now.ToString("h:mm:ss tt") + ": ERROR: " + message;
    Messages.Add(fullError);

    switch (profile.Output) {
        case LogOutput.Unity:
            Debug.Log(fullError);
            break;
        case LogOutput.Console:
            Console.WriteLine(fullError);
            break;
    }
}

/// <summary>
/// Log a warning to the console and add to the log file.
/// </summary>
public static void LogWarning(string message, LogLevel level = LogLevel.Normal) {
    string fullWarn = DateTime.Now.ToString("h:mm:ss tt") + ": WARNING: " + message;
    Messages.Add(fullWarn);

    if (level <= profile.Level && level > 0) {
        switch (profile.Output) {
            case LogOutput.Unity:
                Debug.LogWarning(fullWarn);
                break;
            case LogOutput.Console:
                Console.WriteLine(fullWarn);
                break;
        }
    }
}

/// <summary>
/// Log a message to console and to the log file.
/// </summary>
public static void Log(string message, LogLevel level = LogLevel.Normal) {
    string fullLog = DateTime.Now.ToString("h:mm:ss tt") + ": " + message;
    Messages.Add(fullLog);

    if(level <= profile.Level && level > 0) {
        switch (profile.Output) {
            case LogOutput.Unity:
                Debug.Log(fullLog);
                break;
            case LogOutput.Console:
                Console.WriteLine(fullLog);
                break;
        }
    }
}
```

Since a static class can't have a destructor we need to create a work around. The destructor is responsible for calling SaveLogFile() when the application closes. If you don't want to use this method just make sure to have some external instance call SaveLogFile() elsewhere when the application is closing. Place this sealed class anywhere within the LoggerUtils class.

```c#
/// <summary>
/// This is a little rigged contraption to allow for
/// saving of the log file when the app is closed.
/// Source: https://stackoverflow.com/questions/4364665/static-destructor
/// </summary>
private sealed class Destructor {
    ~Destructor() {
        if (profile.SaveToFile) {
            SaveLogFile();
        }
    }
}
```

Lastly lets add the SaveLogFile() method. I use some helper functions which I will include but you can use your own if you prefer.

```c#
/// <summary>
/// Store all of the log calls made to file.
/// </summary>
public static void SaveLogFile() {
    Log("Saving log file");

    List<byte> logBytes = new List<byte>();

    //Add each message to the byte array and add a new line after each.
    foreach(string msg in Messages) {
        logBytes.AddRange(Encoding.ASCII.GetBytes(msg));
        logBytes.AddRange(Encoding.ASCII.GetBytes(Environment.NewLine));
    }

    //Don't save more than 8 files at any time.
    while(FileUtils.GetFileCount(LogFileDirectory) >= MaxLogCount) {
        FileUtils.DeleteFileAtIndex(LogFileDirectory, 0);
    }

    //Save the file.
    string fullLogFileName = "VoxLogFile" + DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss") + "." + LogFileExtension;
    FileUtils.SaveFile(LogFileDirectory, fullLogFileName, logBytes.ToArray(), false);
}

/// <summary>
/// Returns the number of files in the directory.
/// </summary>
public static int GetFileCount(string directory) {
    if (Directory.Exists(directory)) {
        return Directory.GetFiles(directory).Length;
    }
    else {
        return 0;
    }
}

/// <summary>
/// Save an array of bytes to file. Set overwrite
/// to true to over write any pre existing files.
/// </summary>
public static bool SaveFile(string directory, string fileName, byte[] fileContent, bool overwrite = false) {
    string fullFileName = directory + "/" + fileName;

    //If the folder doesn't exist. Make it.
    if (!Directory.Exists(directory)) {
        Directory.CreateDirectory(directory);
    }

    //File already exists. Check if overwrite is enabled.
    if (File.Exists(fullFileName)) {
        if (overwrite) {
            File.Delete(fullFileName);
        }
        else {
            return false;
        }
    }

    //Create the new filestream.
    FileStream fileStream = new FileStream(fullFileName, FileMode.Create, FileAccess.Write, FileShare.None);

    //Write the content to file.
    using (BinaryWriter binWriter = new BinaryWriter(fileStream)) {
        binWriter.Write(fileContent);
    }

    fileStream.Close();
    return true;
}

/// <summary>
/// Delete the file at specified index in the directory.
/// </summary>
public static bool DeleteFileAtIndex(string directory, int index) {
    if(index >= 0 && index < Directory.GetFiles(directory).Length) {
        string fileName = Directory.GetFiles(directory)[index];
        File.Delete(fileName);

        return true;
    }
    return false;
}
```

To use the new LoggerUtils class simple call LoggerUtils.SetLogProfile(YOUR_PROFILE_HERE). Then use any of it's .Log() methods. If you want to add a way to automatically set the log profile to Unity debug when in the Unity editor add the following tidbit in an Awake() method of a monoBehaviour in your game.

```c#
private void Awake(){
    #if UNITY_EDITOR
        LoggerUtils.SetLogProfile(LogProfile.UnityDebug);
    #endif
}
```
