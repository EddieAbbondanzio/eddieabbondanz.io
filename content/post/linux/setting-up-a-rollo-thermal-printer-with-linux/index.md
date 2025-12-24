---
title: "How To Set Up a Rollo Thermal Printer With Linux"
date: 2025-12-20
type: post
series: "Linux"
---

With my side gig of selling 3d printed parts slowly taking off, I figured it was time to pick up a thermal printer for making shipping labels. I was worried this be easier said than done since I run Pop!\_OS on my laptop but as it turns out Rollo (one of the popular budget friendly printer manufacturers out there) has full linux support and even offers official drivers.

I was able to find a nice lightly used Rollo X1038 printer for $108 shipped and picked up 500 generic 4x6 shipping labels for $8.96.
![](./images/1.jpg)

# Setup

Setting up the printer was surprisingly easy.

1. Head over to [Rollo's site](https://www.rollo.com/driver-linux/) and download / install the appropriate Linux driver for your distro. (I used the Ubuntu one) **Make sure you do this before connecting the printer to your PC!**
2. Connect the printer to your laptop via a USB cable and power it up. It should be auto detected and added but if not you can manually add it.
3. Open up the printer settings and ensure your have the correct label size and orientation configured.
   ![](./images/2-printer-settings.png)
4. Load your labels and [perform the label learning process](https://youtu.be/6CQPBkk8bJM).
5. Download a sample label to test with. [Rollo has one available](https://www.rollo.com/sample/)
6. Open up the sample label and print it. It should just work.

That's it!
![](./images/3-test-label.jpg)

# FAQs

**Why are my labels being printed cut off?**

Double check the following:

- Labels are correctly positioned in the printer
- You've correctly set the paper size and orientation in your OS printer settings
- The program you're printing the label from (ex: Document Viewer) has the correct paper size and orientation configured

If none of the above fix the issue check that the document you are printing has the label positioned correctly. The label should be in the top left corner of the page with no space between it and the edges.

**Will this work for the newer wireless Rollo X1040?**

It _should_, but I don't have one to test with. The wireless printer was too expensive for me.

[Others have had good luck with it though](https://forums.linuxmint.com/viewtopic.php?p=2530379#p2530379)

**Why is my print quality bad?**

If your seeing missing spots or defects in the printed labels [you should try cleaning it](https://www.youtube.com/watch?v=0JwqcQPRWcs).

(You shouldn't have this issue unless you buy a used unit like me)

**Why is my printer printing blank labels after finishing the print?**

If your printer continuously feeds labels through after a print and won't stop unless powered off it could be due to a few different reasons:

- You have the wrong paper size configured somewhere
- You need to do the label learning process so the printer can detect when each label stops

## Bonus: Custom Stand

[If you have a 3d printer and need a stand for your Rollo printer I posted one on Printables](https://www.printables.com/model/1527545-stand-for-rollo-x1038-printer)

![](./images/stand.jpg)
