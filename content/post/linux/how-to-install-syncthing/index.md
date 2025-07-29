---
title: "How to Install Syncthing on Ubuntu"
date: 2025-07-28
type: post
series: "Linux"
thumbnail: "/post/linux/how-to-install-syncthing/images/syncthing-logo.png"
---

Syncthing rocks. I use it to keep my notes and docs synced between my two laptops and it's never let me down. Recently one of my laptops went kaput after an OS upgrade and I was forced to set everything up from scratch (including Syncthing). Thankfully it's pretty easy to set up.

## Steps

1. Install it via the apt package. (instructions taken from [here](https://apt.syncthing.net/))

```bash
sudo mkdir -p /etc/apt/keyrings
sudo curl -L -o /etc/apt/keyrings/syncthing-archive-keyring.gpg https://syncthing.net/release-key.gpg
echo "deb [signed-by=/etc/apt/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
sudo apt-get update
sudo apt-get install syncthing
```

2. Set up a `systemd` service.

`sudo nano /etc/systemd/system/syncthing.servce` and enter the following:

```
[Unit]
Description=Syncthing Daemon

[Service]
Type=simple
ExecStart=/usr/bin/syncthing
User=$YOUR_USER_HERE

[Install]
WantedBy=multi-user.target
```

Enable and start the service.

```bash
sudo systemctl enable syncthing.service
sudo systemctl start syncthing.service
```

Then check for any errors in `systemctl status syncthing`. If everything worked, you can access the web UI at http://127.0.0.1:8034 and start customizing Syncthing.
