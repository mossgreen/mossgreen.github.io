---
title: File Name on Mac, Linux and Windows
search: true
tags: 
  - Linux
  - Windows
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
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

## Linux

Linux has a maximum filename length of 255 characters for most filesystems (including EXT4), and a maximum path of 4096 characters.

Empirically, we have found that character filenames longer than 143 characters start requiring >255 characters to encrypt. So we (as eCryptfs upstream developers) typically recommend you limit your filenames to ~140 characters.


## Windows

Individual components of a filename (i.e. each subdirectory along the path, and the final filename) are limited to 255 characters, and the total path length is limited to approximately 32,000 characters. However, you should generally try to limit path lengths to below 260 characters (MAX_PATH) when possible. See http://msdn.microsoft.com/en-us/library/aa365247.aspx for full details.


It's 257 characters. To be precise: NTFS itself does impose a maximum filename-length of several thousand characters (around 30'000 something). However, Windows imposes a 260 maximum length for the Path+Filename. The drive+folder takes up at least 3 characters, so you end up with 257.


## References

- [What is the maximum allowed filename (and folder) size with eCryptfs](https://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs)

- [Naming Files, Paths, and Namespaces](https://msdn.microsoft.com/en-us/library/aa365247.aspx#naming_conventions)
- [Maximum filename length in NTFS (Windows XP and Windows Vista)?](https://stackoverflow.com/questions/265769/maximum-filename-length-in-ntfs-windows-xp-and-windows-vista)