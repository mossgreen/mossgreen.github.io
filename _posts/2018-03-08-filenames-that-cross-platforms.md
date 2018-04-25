---
title: Filenames That Cross Platforms
search: true
tags: 
  - Linux
  - Windows
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---
> The most conservative file naming conventions provide the most cross-platform compatibility.

## TL;DR. 
- To compatible with old system shall follow **8.3 rule**
- Otherwise, limit filenames to the characters A-Z, a-z, 0-9, underscore ( _ ), period ( . ), and hyphen ( - ).

## Raise the questions

I developed a module to our software, in which it collects images from a file system and concatenates its caption to file name, then zips all files. Users can download this zip file and unzip it.

Simple as? Nah! I need to answer the following questions

1. How long can a directory name be?
2. How long can a file name be?
3. Can I use special characters in the directory name or file name?

## Research on MAC, LINUX and Windows

### Linux

- Linux has a maximum filename length of 255 characters for most filesystems
- **eCryptfs** recommends filenames shall no longer than 143, otherwise, it requires more than 255 characters to encrypt

### Windows 10

- Filename length is limited to 255 characters
- **MAX_PATH** is defined as 260 characters  
- **Reserved Characters**: 
  - `< (less than)`, 
  - `> (greater than)`, 
  - `: (colon)`, 
  - `" (double quote)`, 
  - `/ (forward slash)`, 
  - `\ (backslash)`, 
  - `| (vertical bar or pipe)`, 
  - `? (question mark)`,
  - `* (asterisk)`

### Give it a go on MAC

I'm using MAC with MAC OS X, so I just gave it a go.

Conclusions:

- Filename allows everything, except: `/`  
- Need to escape some special characters, like `\?`, `\*`. Otherwise, it behaves weirdly
- Mac max directory name length: 255 
- Mac max file name length: 255


**Not Allowed:** `/`
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

**Weird parts**

If a file named **?** exists, you cannot do `mkdir *`, which will return `mkdir: ?: File exists`
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
  
**Mac max file name length: 255**
```bash
touch [256_charactors_here] //File name too long
touch [255_charactors_here_including_extension] //File created
```

## Research result:

1. Most restrict rule is known as **8.3**, which shall always work on any platform.
2. Avoid using "special" non-alphanumeric characters, they may be reserved for special purposes depending on the OS.
3. Avoid using white space characters such as **spaces**, **tabs**, **new lines** and **embedded returns**.
4. Filenames must not lead with `.(dot)`, `-`
5. Directory and file names should not be too long, **140 is recommand**.
6. Using filename extension, like `.jpg` and `.doc`
7. Must not use periods in directory (folder) names

## Java implementation

### Replace replace everything but [a-zA-Z0-9.-] 

```java
myString = myString.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
```



## References

- [MSDN: Naming Files, Paths, and Namespaces](https://msdn.microsoft.com/en-us/library/aa365247.aspx#naming_conventions)

- [OS X: Cross-platform filename best practices and conventions](https://support.apple.com/en-us/HT202808)

- [Mac and Windows OS File/Folder naming rules](http://www.portfoliofaq.com/pfaq/FAQ00352.htm)

- [Recommendations for Limitations on Image Filenaming](https://www.controlledvocabulary.com/imagedatabases/filename_limits.html)

- [What is the maximum allowed filename (and folder) size with eCryptfs](https://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs)

- [Wikipedia: eCryptfs](https://en.wikipedia.org/wiki/ECryptfs)