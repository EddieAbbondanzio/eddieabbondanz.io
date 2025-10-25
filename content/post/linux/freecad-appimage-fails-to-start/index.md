---
title: "FreeCAD AppImage Fails to Start Due to SquashFS Error"
date: 2025-08-04
type: post
category: "Linux"
thumbnail: "/post/linux/freecad-appimage-fails-to-start/images/freeCAD.svg"
---

If you're trying to install FreeCAD on Linux via an appimage and your running into a `Squashfs image uses (null) compression, this version supports only xz, zlib` error on startup it's due to a bug in AppImageLauncher. This is a [known bug](https://github.com/TheAssassin/AppImageLauncher/issues/585) that's been [fixed](https://github.com/TheAssassin/AppImageLauncher/pull/690) for a few months but at the time of writing this (2025-08-04) the fix hasn't been included in any releases yet.

AppImageLauncher hasn't published any releases since 2020 so it could be awhile before it's actually released though. I didn't want to wait for them to publish a release before I can use FreeCAD so I opted to uninstall it and set up the appimage myself.

Manually installing an appimage is actually pretty easy. You just need to create a `.desktop` file for it in `~/.local/share/applications` and place the appimage somewhere appropriate. (usually `~/Applications`)

## Manual Install Steps

1. Uninstall AppImageLauncher `sudo apt purge appimagelauncher` (this was the only way I could circumvent AppImageLauncher from trying to start the appimage each time)
2. Reboot your machine
3. Download the latest stable FreeCAD appimage from [GitHub](https://github.com/FreeCAD/FreeCAD/releases)
4. Move the appimage to `~/Applications`
5. Ensure the appimage has execution permissions. `sudo chmod +x $APP_IMAGE_NAME`
6. Create the desktop file. `nano ~/.local/share/applications/freecad.desktop` and enter the following:

```
[Desktop Entry]
Type=Application
Name=FreeCAD
# NOTE: Your path will be different. Be sure to update accordingly.
Exec=/home/ed/Applications/FreeCAD_1.0.1-conda-Linux-x86_64-py311_fdcc6ae07806cc916b7b460da658191f.AppImage
```

7. `ctrl+s` to save the file and close it out.

You should now be able to run FreeCAD like any other application.

### Fixing the Desktop Icon (Optional)

If you followed the steps above and noticed that the FreeCAD icon isn't properly showing it's because your OS doesn't know how to find it. This can be fixed by adding an `icon` path in the `.desktop` file.

1. Navigate to the directory where you put the appimage and open up a terminal prompt.
2. Open a terminal and run `$APP_IMAGE_NAME.AppImage --appimage-extract *.FreeCAD.svg`.
3. A new `squashfs-root` directory should have appeared. Copy the icon `org.freecad.FreeCAD.svg` from inside it over to `~/.local/share/icons`. (Don't forget to delete the `squashfs-root` dir after)
4. Edit the `.desktop` file `nano ~/.local/share/applications/freecad.desktop` and add a new line:

```
# (Your path will be different unless your username is also ed)
Icon=/home/ed/.local/share/icons/org.freecad.FreeCAD.svg
```

5. Save and close out the file.

Now the icon should show up.

![](./images/launcher.png)

## Further Reading

- If you'd like to learn more about desktop files. See the [specs](https://specifications.freedesktop.org/desktop-entry-spec/latest/)
