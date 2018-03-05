---
layout: post
title: "Users, sudo and privileges"
permalink: "/shell/2018/02/25/users-sudo-and-privileges/"
date: 2018-02-25 15:31:00 +0200
categories: [devops]
tags: [shell, linux]
description: >-
  Quick example of how to manage user's privileges on Linux.
---

Regardless of whether we work on existing users or create new ones.
Almost always default privileges are not what we want.

## Create new user

Only root and sudoers can create new users.
`adduser` is an interactive creator. All answers are optional.

```console
$ sudo adduser
Changing the user information for username
Enter the new value, or press ENTER for the default
    Full Name []:
    Room Number []:
    Work Phone []:
    Home Phone []:
    Other []:
Is the information correct? [Y/n]
```

## Check existing groups

List all groups

```console
$ groups
pawelzny sudo www docker testuser
```

List groups in which user belongs to

```console
$ groups testuser
testuser : testuser
```

## Add user to sudo group

User can use `sudo` only if is in `sudo` group.
You may also add user manually to `/etc/sudoers`.

```console
$ sudo usermod -aG sudo testuser
```

* `-a` append instead of override
* `-G <group>` set group

## Sudoers privileges

Manage privileges by editing `/etc/sudoers` file.
User can have access to all or specific commands without being in sudo group.

```console
$ sudo vim /etc/sudoers
```

Add as many lines as you need.

### Grant access to all sudo commands

Access to all commands with password:

```
testuser ALL=(ALL:ALL) ALL
```

Access to all commands without password:

```
testuser ALL=(ALL:ALL) NOPASSWD: ALL
```

### Grant access to specific sudo command

Disable all commands and then grant access to specific command, one without password.

```
testuser ALL=(ALL:ALL) !ALL
testuser ALL=(ALL:ALL) /sbin/poweroff
testuser ALL=(ALL:ALL) NOPASSWD: /sbin/reboot
```
