---
title: "MySQL - Setting up a MySQL Server with Ubuntu via VirtualBox Part 2"
date: 2018-07-23T06:58:42-04:00
type: post
categories: ["MySQL"]
---

Part 2: Installing Ubuntu
===

With out virtual machine ready to be fired up thanks to part 1, we are now ready to begin
installing Ubuntu. If you don't have VirtualBox open, go ahead and do so now. Highlight 
the VM that we just set up and click **Start**

<img src="/img/mysql/mysql-server-tutorial/pt2/1.png" class="image-center">

Okay I lied. There's actually one last step we need to do and that's specify the location
of our Ubuntu ISO file that we downloaded earlier. Click the little folder icon next to
the drop down and locate the ISO file. 

<img src="/img/mysql/mysql-server-tutorial/pt2/2.png" class="image-center">

Now we are ready to begin! Click **Start** and let the VM do it's thing.

<img src="/img/mysql/mysql-server-tutorial/pt2/3.png" class="image-center">

If everything worked accordingly, you'll be taken to the install screen for Ubuntu. 
Go ahead and select **Install Ubuntu**

<img src="/img/mysql/mysql-server-tutorial/pt2/4.png" class="image-center">

Both of these options are up to you, but I recommend selecting the checkbox next
to **Download updates...**

<img src="/img/mysql/mysql-server-tutorial/pt2/5.png" class="image-center">

While this page may seem a little scary due to the warning don't worry as the VM only
has access to the small partition that we created for it earlier. In no way will it harm your actual OS.

Since this server will only be used for development we won't be encrypting it as it 
will never be publicly accessible. Select **Install Now**, then **Continue** on the popup that appears.

<img src="/img/mysql/mysql-server-tutorial/pt2/6.png" class="image-center">
<img src="/img/mysql/mysql-server-tutorial/pt2/7.png" class="image-center">

If the timezone selected by default isn't yours, go ahead and update it to correctly
reflect your location and hit **Continue**.

<img src="/img/mysql/mysql-server-tutorial/pt2/8.png" class="image-center">

Pick your keyboard layout. If your unsure, you probably just want the default. If your window is
cut off like mine try dragging it via the top gray portion. Ubuntu doesn't seem to like
such a small display of 800x600 pixels.
<img src="/img/mysql/mysql-server-tutorial/pt2/9.png" class="image-center">

The last step! Fill out all of the fields, and then hit **Continue**.

<img src="/img/mysql/mysql-server-tutorial/pt2/10.png" class="image-center">

Ubuntu will now begin to install itself onto the VM. Sit back and hold tight for a bit while it does
it's thing.

<img src="/img/mysql/mysql-server-tutorial/pt2/11.png" class="image-center">

Once Ubuntu has completed installing you'll be prompted to perform a restart. Hit **Restart Now**.

<img src="/img/mysql/mysql-server-tutorial/pt2/12.png" class="image-center">

You don't actually have to remove anything when this appears. Just hit **Enter**.

<img src="/img/mysql/mysql-server-tutorial/pt2/13.png" class="image-center">

Once rebooted, go ahead and log into your account. Your now ready for part 3!

<img src="/img/mysql/mysql-server-tutorial/pt2/14.png" class="image-center">
<img src="/img/mysql/mysql-server-tutorial/pt2/15.png" class="image-center">
