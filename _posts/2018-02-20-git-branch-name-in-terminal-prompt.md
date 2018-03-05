---
layout: post
title: "GIT branch name in terminal prompt"
permalink: "/shell/2018/02/20/git-branch-name-in-terminal-prompt/"
date: 2018-02-20 08:55:00 +0200
categories: [tools]
tags: [git, shell, bash, terminal]
description: >-
  Code snippet which allow to render GIT branch name in terminal prompt.
image: /assets/img/git-branch-in-terminal-at-pawelzny.com.png
---
When developing its nice to know on what GIT branch we are working on.
Instead of typing `git status` every time to check branch name,
let's make prompt customization to render branch name for us.

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i> <strong>INFO</strong><br>
    This tutorial is for Linux, Debian family.
</div>

Branch name will be visible only when we are in directory under GIT
version control.

Login as user then edit `.bashrc` file.

```console
$ sudo su username
$ vim ~/.bashrc
```

At the end of the file copy and paste below snippet.
Colors are customizable. I choose one which compose good with default
Ubuntu terminal theme.

```sh
parse_git_branch() {
   git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
export PS1="${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$\[\033[33m\]\$(parse_git_branch)\[\033[00m\] "
```

Linux read configuration files in sequence so in case you want to change **PS1** prompt,
changes have to be made in `.bashrc` file.
To make the changes visible reopen terminal, re-login or source `.bashrc`.

```console
$ source ~/.bashrc
```

<img src="{{ "/assets/img/git-branch-in-terminal-at-pawelzny.com.png" | absolute_url }}"
     alt="Terminal window with example of how GIT branch name could look @pawelzny"
     class="img-fluid rounded mx-auto d-block"/>
