---
title: Git and Git Workflow
search: true
tags: 
  - Git
  - Github
  - Git Workflow
toc: true
---

Git and Git Workflow practical tips.

-- just copy&paste my local notes, but definitely I need to restructure them.

## Introdution

### Terminology

## History

## notes

### git reset VS git checkout --

- use `git reset` when you want to give up the commit
- use `git checkout -- .` when you want to give up the files before adding it
  - it will cause some **Untracked files**, you need to use `git clean -df`

### How to remove local (untracked) files from the current Git working tree

  ```bash
  # see which files will be deleted
  $ git clean -n
  
  # actual delete command
  $ git clean -f
  
  # To remove directories, even with DELETED FILES
  $ git clean -f -d #or git clean -fd
  
  # ve ignored files
  $ git clean -f -X #or git clean -fX
  
  # To remove ignored and non-ignored files
  # Not the case difference on the X
  $ git clean -f -x or git clean -fx
  ```

### Undo a commit and redo

```bash
$ git commit -m "Something terribly misguided"              (1)
$ git reset HEAD~                                           (2)
<< edit files as necessary >>                               (3)
$ git add ...                                               (4)
$ git commit -c ORIG_HEAD  
```

### reset to origin head

```bash
git fetch origin
git reset --hard origin/master
```

### `git stash`

- When you want to save some code temporarily before change to another branch
- But when you come back to this branch, you need to use `git stash apply`
- `git stash clear`

```bash
# Git allows you to stash untracked files with the --include-untracked or -u option:
git stash -u

# Git also has an --all or -a option for stash that will stash both untracked and ignored files:
git stash -a
```

### git commit --amend  

1. You want to change the commit message
    `git commit --amend -m “New commit message"`

2. You want to add a file after commiting, or: add this file to your previous commit

    ```bash
    git add file6
    git commit --amend --no-edit
    ```

    **--no-edit** means that the commit message does not change.

### git set upstream

If you're on current branch, run:
`git branch -u upsteam/currentBranch` which equals to
`git branch --set-upsteam-to=origin/currentBranch`

e.g., you're on PN-111: **git branch -u origin/PN-111**

However, if you're not on current branch, you need to:

**git branch -u origin/PN-391 PN-391**:

`git branch -u upstream/theBranch theBranch` which equals to
`git branch --set-upstream-to=upstream/theBranch theBranch`

## References

Last update: Aug 2020
