---
layout: post
title: "GIT branch name in terminal prompt"
date: 2018-02-20 08:55:00 +0200
categories: [shell]
---

<div class="alert alert-info">
    <i class="fa fa-info-circle"></i> <strong>INFO</strong><br>
    This tutorial is for Linux, Debian family.
</div>

Login as user then edit `.bashrc` file.

```console
$ sudo su username
$ vim ~/.bashrc
```

At the end of file paste these lines:

```sh
parse_git_branch() {
   git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
export PS1="${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$\[\033[33m\]\$(parse_git_branch)\[\033[00m\] "
```

Linux read configuration files in sequence so in case you want to change **PS1** prompt,
changes have to be made in `.bashrc` file.
To make the changes visible reopen terminal, relogin or source `.bashrc`.

```console
$ source ~/.bashrc
```
