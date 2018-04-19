---
title: File Name on Mac, Linux and Windows
search: true
tags: 
  - Linux
  - Windows
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
> How difficult it is to make app cross-platform?

## Why I care about this question?

I develped a module, in which it collects images from a file system and concatenates captions to file name, then zips all files. Users can download this zip file and unzip it.

Simple as.

However I got following issues:

1. illegal charactors for file name
2. Directory could be too long
3. File name could be too long


## mac file name illegal charactors

**Allowed: Everything, except: ** `/`  

**Not Allowed:**
  ```bash
  moss$ mkdir "/"
  mkdir: /: Is a directory
  
  moss$ mkdir "//"
  mkdir: //: Is a directory
  
  moss$ mkdir "/4"
  mkdir: /4: Permission denied
  
  moss$ mkdir haha/haha
  mkdir: haha: No such file or directory
  ```

**Weird**

if a file named **?** exists, you cannot do `mkdir *`, which will return `mkdir: ?: File exists`
  ```bash
  moss$ ls -a
  .	..
  moss$ mkdir ?
  moss$ ls -a
  .	..	?
  moss$ mkdir *
  mkdir: ?: File exists
  moss$ ls -a
  .	..	?
  moss$ rm -rf ?
  moss$ mkdir *
  moss$ ls -a
  *	.	..
  ```
## mac max directory name length: 255 
```bash
mkdir [256_charactors_here] //File name too long
mkdir [255_charactors_here] //File created
mkdir -p [255_charactors_here]/[255_charactors_here] // 

## mac max file name length: 255

```bash
touch [256_charactors_here] //File name too long
touch [255_charactors_here_including_extension] //File created
```
