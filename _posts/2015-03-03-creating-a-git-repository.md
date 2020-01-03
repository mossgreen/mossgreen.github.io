---
title: Two Ways of Creating a Github Repository
search: true
categories: 
  - Git
---

Creating Github repo from either remote or locally.

## Two ways of creating a GitHub repository

There are two ways to create a Github repository. One is pushing from local to remote, another is pulling from remote to local.

### 1. Create a repo on Github and Clone it to local

1. Create a repo on Github
2. Go to the project, find a URL
3. Go to your local folder, run command `git clone URL`

### 2. Create a local repository, push it to your Github account

1. Go to your Github page,  create a new repository, select **Push an existing repository**, get your **repo address**
2. Create a directory to contain the project, go into this directory
3. `git init` to initialise it as a Git Repository
4. You’ll probably want to create a `.gitignore` file
5. Run `git add .` and `git commit -m "Commit message"`
6. In your local, run `git remote add origin REPO_URL`. You can get your REPO_URL from `git remote -v`
7. Push your code: `git push -u origin YOUR_BRANCH`, in this case can be `git push -u origin master`

### 3. Configure remote url

```bash
# works without internet
\$ git config --get remote.origin.url

# works with internet
\$ git remote show origin
```

## References

- [Start a new git repository](http://kbroman.org/github_tutorial/pages/init.html)
- [Understanding git init](https://stackoverflow.com/questions/13525629/understanding-git-init)

Last Updated: Dec 2019
