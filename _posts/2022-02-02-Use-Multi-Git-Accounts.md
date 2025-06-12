---
title: Use multi git accounts on mac
tags:
  - git
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

One for company, one for yourself.

## Why you need two accoutns

If you have both personal and company GitHub accounts, it is best practice to set up a separate SSH key for each account. This approach avoids authentication conflicts and keeps your personal and work credentials isolated

## Steps

### Set Up Multiple SSH Keys

```bash
ssh-keygen -t rsa -C "your_personal_email@example.com" -f ~/.ssh/id_rsa_personal

ssh-keygen -t rsa -C "your_company_email@example.com" -f ~/.ssh/id_rsa_company
```

### Add Each Public Key to the Corresponding GitHub Account

Go to GitHub > Settings > SSH and GPG keys, and add the correct public key for each account.

### Edit Your SSH Config File on Mac

~/.ssh/config and add entries for each account:

```conf
# Personal GitHub
Host github-personal
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_personal
IdentitiesOnly yes

# Company GitHub
Host github-company
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_company
IdentitiesOnly yes
```
- Host is just a label, for you to easy remember
- User must be git


## How to use

1. for existing git, do things normally, e.g., `git pull` under your project
2. for new project, under github project/code/ssh, you have sth like `git@github.com:yourUserName/yourProjectName.git`


## References

- [How To Work With Multiple Github Accounts on your PC](https://gist.github.com/rahularity/86da20fe3858e6b311de068201d279e3)
