---
layout: post
title: "Global .gitignore file"
date: 2018-04-17 17:30:00 +0200
categories: [tools]
tags: [git]
description: Ignore files once and forget.
---

Why you should ignore files globally? - You shouldn't but who can stop you!?

Some IDE and text editors stores cache or file index in project directory.
These files are very often commited to remote repository. Way too often.

## Ignore them once and for all!

<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-triangle"></i> <strong>WARNING!</strong> <br>
    Just remember it works only on your machine and won't be propagated
    to remote repository.
</div>

### Create new global .gitignore file

Filename and directory doesn't matter.

```console
$ vim ~/.global_gitignore
```

### Put in all not wanted files

You can place any entry you want as you do in normal .gitignore file.
But make it slim and use only for most frequent and annoying files.

For example for files which occures only on your machine.

- You are the only MacBook user in team? - Everybody hates .DS_store!
- Maybe you are the only one who uses PyCharm or WebStorm or whatever
  else JetBrains has created? - Everybody hates .idea directory!

```text
# macOS
.DS_store

# IDE
.idea/
.vs_code/

# temporary backup which should not be committed
*.old.*
*.backup.*

# my own tools which helps me, but not fit in project
*_pawelzny.*
```

**Edit [2018-09-08]:**

Do not put comments in the same line as rule because git will treat them as integral part of the rule.

Do:

```text
# comment
rule
```

Don't:

```text
rule   # comment
```

### Add the file to git config

```console
$ git config --global core.excludesfile "~/.global_gitignore"
```

<div class="alert alert-info" role="alert">
    <i class="fas fa-info-circle"></i> <strong>INFO</strong> <br>
    This command <strong>works for Windows too</strong>,
    but require absolute path to file ie.
    <code>C:\users\user\.global_gitignore</code>
</div>

**And voilà!**
