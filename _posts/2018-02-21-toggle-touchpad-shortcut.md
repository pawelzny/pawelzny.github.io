---
layout: post
title: "Toggle TouchPad shortcut"
date: 2018-02-21 14:29:00 +0200
categories: [shell]
tags: [shell, ubuntu, touchpad]
---

On my MSI laptop I was able to enable and disable touchpad with `fn + F3` shortcut.
It is not the case anymore. Default shortcut has stop working some day without any warning.

I found a thread on [Ask Ubuntu](https://askubuntu.com/a/863750/623770) which helped me with my issue.
All credits goes to [wineunuuchs2unix](https://askubuntu.com/users/307523/wineunuuchs2unix),
thank You very much for contribution to community.

I've made slight modification to increase readability.
I've changed urgency level and icons to those which can be found in Ubuntu 17.10.

First of all check TouchPad ID on your machine.

```console
$ xinput list | grep -i touchpad
⎜   ↳ SynPS/2 Synaptics TouchPad              	id=15	[slave  pointer  (2)]
```

It appears that on my machine TouchPad has `id=15`.

Create new shell script.

```console
$ sudo vim /usr/bin/toggle-touchpad
```

Copy and paste below script, and change `xinput_id=15` to ID of TouchPad on your machine.

```sh
#!/bin/bash

# NAME: toggle-touchpad
# PATH: /usr/bin
# DESC: Update pulseaudio output device when HDMI TV plugged / unplugged
# CALL: called from Keyboard Shortcut `Super`+`T`
# DATE: Created Dec 23, 2016.
# NOTE: Originaly written for AU question: https://askubuntu.com/a/863750/623770
# COPYRIGHT: WinEunuuchs2Unix, Pawelzny

xinput_id=15  # This ID may differ for every machine.

if [[ $(xinput list $xinput_id | grep -Ec "disabled") -eq 1 ]]; then
    xinput enable $xinput_id
    DISPLAY=:0 notify-send \
               --urgency=normal \
               --icon=/usr/share/icons/HighContrast/256x256/devices/input-touchpad.png \
               "Touchpad enabled"
else
    xinput disable $xinput_id
    DISPLAY=:0 notify-send \
               --urgency=normal \
               --icon=/usr/share/icons/HighContrast/256x256/status/touchpad-disabled.png \
               "Touchpad disabled"
fi
exit 0
```

Make the script executable.

```console
$ sudo chmod a+x /usr/bin/toggle-touchpad
```

Go to `settings` --> `devices` --> `keyboard`
and create custom shortcut `Super+T` for `/usr/bin/toggle-touchpad` script.

<img src="{{ "/assets/img/toggle-touchpad-shortcut.png" | absolute_url }}"
     alt="My helpful screenshot"
     class="img-fluid rounded mx-auto d-block"/>
