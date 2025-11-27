---
title: "My $460 Scratch Built NAS with 12TB of Storage"
date: 2025-11-27
type: post
categories: "Homelab"
---

I've been having some fun dipping my toes into the realm of homelabbing and decided it was time to build a proper NAS. I used to back up my data between my two laptops using Syncthing and I felt fairly safe with that setup because if one laptop died I'd still have all the data on the other laptop.

This mostly worked but there were some reliability issues because it required both laptops to be awake at the same time so they could sync up and that wasn't always the case so my "back up" could be up to a week or more out of date. I also sold off one of the laptops due to not using it enough so I was back to square one and no longer had any backups.

## My New To Me HP EliteDesk G3 800 SFF

I know you can easily buy a pre built NAS but I like collecting old tech because it's cheap and I wanted to get more practical experience configuring servers so I opted to go the DIY route. A NAS doesn't need a super strong CPU so older PCs work great for this and I ended up snagging a nice used HP EliteDesk G3 800 off Ebay for $70.
![](./images/1.jpg)

It's got an Intel i5-6500 CPU and came with (1) 8gb stick of ram that I ended up adding a second one for another $15 since it's cheap. It also had a 500gb 3.5" drive inside of it but I swapped that out in favor of two refurbished 12tb Western Digital Ultrastars and added a 256gb NVME SSD to use as a boot drive.
![](./images/2.jpg)

The Ultrastars were the most expensive part of this build and came in at just shy of $360 total. The SSD was a spare drive I had laying around from an old laptop. I also plopped in a spare wifi card I had laying around from the same laptop as the SSD. The NAS will spend most of it's life hardwired so it won't really need wifi but it made life easier having wifi when setting up the server.

Since the PC only came with 1 hard drive I didn't have enough HD screws for two drives so I ended up printing some customs ones out of PETG and 6-32 screws. I also had to clip the 3.3v power wire to get them to work in my setup but that was easy enough with a butt connector.
![](./images/3.jpg)

Something cool about the Elitedesk is that it even has an extra bay for a 2.5" SSD but as of right now I don't have any plans to use that. If I ever fill up my first two drives I may explore making a custom HD rack that can hold 4 of them.
![](./images/4.jpg)

## Tech Stack

OS wise it's running Debian 13 (Debian is my goto for servers) and uses [ZFS](https://pve.proxmox.com/wiki/ZFS_on_Linux) to run both drives in RAID1 so they're mirrored for redundancy.

In terms of NAS functionality I use [Samba](https://www.samba.org/) to create network accessible shares. I considered using NFS since all of my devices run Linux but in the future I plan on adding a Windows device to my fleet so I wanted the NAS to support Windows as a precaution. It also has [Syncthing](https://syncthing.net/) installed so it's automatically backing up my laptop in realtime.

Security wise both 12tb drives are encrypted via a ZFS dataset and the ZFS encryption key file is stored on the boot drive that gets encrypted via LUKS.

Since I'll need to unlock the boot drive each time it turns on I installed [dropbear](https://github.com/mkj/dropbear) so I could SSH in to enter the passphrase. I then took this one step further and wrote a python script that I can run from my laptop to automate unlocking the boot drive.

In the event the boot drive were to fail I should be able to reconfigure a new one in about 30 minutes because I provisioned the server using ansible and wrote some scripts to generate a debian preseed file so I have an ISO that's pre-configured and can be ran as an automated install.

Ansible and a Debian preseed may be overkill for provisioning a personal sever but this is my 6th server I've set up now and I'm getting tired of doing it manually so I wanted to try out automating the process.

## Total Cost

All in all this build cost me $461.82 which I'd consider a great price for 12TB of storage.

| Part                                | Price                  |
| ----------------------------------- | ---------------------- |
| HP Elitedesk G3 800 SFF PC          | $70.30                 |
| (1) 8gb DDR4 RAM DIMM               | $15.77                 |
| (2) 12TB Western Digital Ultrastars | $359.98                |
| (2) SATA cables                     | $15.77                 |
| Intel Wifi Card                     | Free (from old laptop) |
| 256gb NVME SSD                      | Free (from old laptop) |

I may do some upgrades in the future like swapping out the i5-6500 for an i7-7700 and adding another 16gb of ram but it already works great as-is and that would be more for future proofing.
