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

### 1. Set Up Multiple SSH Keys

```bash
ssh-keygen -t rsa -C "your_personal_email@example.com" -f ~/.ssh/id_rsa_personal

ssh-keygen -t rsa -C "your_company_email@example.com" -f ~/.ssh/id_rsa_company
```

### 2. Add to ssh key agent

```bash
ssh-add -K ~/.ssh/id_rsa_personal
ssh-add -K ~/.ssh/id_rsa_company
```
Tip: Use ssh-add -l to list currently loaded keys.

### 3. Add Public Key to the Corresponding GitHub Account

Go to GitHub > Settings > SSH and GPG keys, and add the correct public key for each account.

### 4.Edit Your SSH Config File on Mac

`~/.ssh/config` and add entries for each account:

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

- `Host` is just a shortcut (you’ll use it in git clone)
- `User` must always be `git`
- `HostName` should stay `github.com`

### 5. Test Your SSH Connections
Before cloning any repo, verify both connections:

```bash
ssh -T git@github-personal
ssh -T git@github-company

Hi yourPersonalUsername! You've successfully authenticated, but GitHub does not provide shell access.
Hi yourCompanyUsername! You've successfully authenticated, but GitHub does not provide shell access.
```

### 6. Clone Repositories Using the Correct Host

Use the corresponding host alias defined in ~/.ssh/config:

```bash
# Clone a personal repo
git clone git@github-personal:yourPersonalUsername/your-repo.git

# Clone a company repo
git clone git@github-company:yourCompanyOrg/your-repo.git
```
## How to use in each project

Once your repository is cloned, configure user info per project:

```bash
git config user.name "Your Name"
git config user.email "your_email@example.com"
```
You can check settings anytime:
```bash
git config user.name
git config user.email
```

## Optional: Default Git Identity per Directory (macOS)

If you often switch between personal and company projects, you can automate user identity.
This means you can automatically set your user.name and user.email for all projects under a folder, without manually running git config each time.

Step-by-Step Setup
1. Organize your projects, Every Git repository inside these folders will inherit the correct identity.

```bath
~/work/       # all company projects
~/personal/   # all personal projects
```
2. Edit your global Git config
nano ~/.gitconfig
```bash
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-company

[includeIf "gitdir:~/personal/"]
    path = ~/.gitconfig-personal
```

3. Create the included config files
Company config (~/.gitconfig-company):
```bash
[user]
    name = Your Company Name
    email = your_company_email@example.com
```
Personal config (~/.gitconfig-personal):
```bash
[user]
    name = Your Personal Name
    email = your_personal_email@example.com
```
4. How it works
  1. Create a new repo under ~/work/project1:
  ```bash
  mkdir -p ~/work/project1
  cd ~/work/project1
  git init
  ```
  2. Git will automatically use the company identity (user.name and user.email) from ~/.gitconfig-company.
  3. Similarly, a repo under ~/personal/project2 will automatically use your personal identity.
  4. No need to run git config user.name/email manually in each repo.


## References

- [How To Work With Multiple Github Accounts on your PC](https://gist.github.com/rahularity/86da20fe3858e6b311de068201d279e3)
