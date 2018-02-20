---
layout: post
title: "Make your own SSL tunnel"
date: 2018-02-19 16:31:00 +0200
categories: [ssl]
---

App development may be imposible if external resources require connection over HTTPS.
For example Facebook Messenger require HTTPS connections in both directions.

This is more than likely that your dev machine doesn't have public IP and installed SSL cert.

What you need is SSL tunnel to work. Make one for your self for free or low cost using VPS.

I am going to use Apache2 as proxy server, and Let's Encrypt for SSL certificate.

## Step 1: SSH key

Make sure you can login to the VPS using SSH.

If not create SSH key on your local machine [generating-a-new-ssh-key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#generating-a-new-ssh-key)

And add your key to user authorized_keys `~/.ssh/authorized_keys` on VPS.

## Step 2: Configure Apache2 proxy

At this point, make sure your domain is pointing to server IP.

```console
$ sudo vim /etc/apache2/sites-available/tunnel.conf
```

Copy and paste configuration and change `tunnel.domain.com` for your preference.
I choose to redirect on port 24001 because in general it is unused.
Read about well known port numbers [https://www.webopedia.com/quick_ref/portnumbers.asp](https://www.webopedia.com/quick_ref/portnumbers.asp)

```apache
<VirtualHost *:80>
  ServerName tunnel.domain.com

  ProxyPass "/" "http://localhost:24001/"
  ProxyPassReverse "/" "http://localhost:24001/"
  ProxyPreserveHost On

  RewriteEngine on
  RewriteCond %{SERVER_NAME} =tunnel.domain.com
  RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,QSA,R=permanent]
</VirtualHost>
```

Enable site

```console
$ sudo a2enmod proxy rewrite
$ sudo a2ensite tunnel
$ sudo service apache2 reload
```

## Step 3: Create SSL cert

If you don't have SSL cert read how to get [Free SSL certificates]({% post_url 2018-02-19-free-ssl-certificates %}) using Let's Encrypt

## Step 4: Connect local machine to tunnel

Connect over SSH, listen on remote port 24001 and redirect to local port 8000.

```console
$ ssh -R 24001:localhost:8000 user@tunnel.domain.com -N
```

Run local app on port **8000**.
