---
title: Searching Text Using grep in Linux
search: true
tags: 
  - Linux
  - grep
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

How to search text in your files in Linux?

## Why I want to use Linux grep?

1. I want to search a text in file.
2. I want to know the files that contains a key word.
3. I want to know the key works in the files.


## About grep

`grep` is a powerful file pattern searcher in Linux.

`grep` stands for "global regular expression print". It processes text line by line and prints any lines which match a specified pattern.

### Install grep

```bash
$ sudo apt-get install grep         # Debian/Ubuntu

$ sudo yum install grep             # RHEL/CentOS/Fedora

$ whereis grep                      #/usr/bin/grep
```

### Parameters
//todo


## Search in one file

1. Search a string in a file
    
    ```bash
    $ grep 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    ```

    ![IMAGE](https://i.loli.net/2019/10/16/uNFgyp8TnxBUrDo.jpg)

    It returns all the lines that contain given string.

2. Search a string in a file case insensitive `-i`

    ```bash
    $ grep -i 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    ```

    ![IMAGE](https://i.loli.net/2019/10/16/FYlMNvGwzZJorRB.jpg)
    
    It returns all the lines that contain given string insensitive.

3. Search a string as a whole word `-w`

    ```bash
    $ grep -w -i 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    ```
    
    ![IMAGE](https://i.loli.net/2019/10/16/1t5Tr6snafwziKN.jpg)
    
    It returns only the whole words.

4. Count the Matching Lines

    ```bash
    $ grep -Fc 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    6
    ```
    
    grep is a line-based search utility. The `-c` option will output the count of matched lines instead of the count of pattern occurrences. 

5. Grep in `ls`

    ```bash
    ls -lt | grep 'Feb 28 2046'
    ```

## Recursively Search a Directory

1. find all files that contain some pattern.

    ```bash
    $ grep -Rl 'mossgu'  ./
    ```
    
    Use the `-l` option to skip the matching information and let grep print only the file names of matched files.

2. list how many times a string shows in each file
    ```bash
    grep -RlFc 'mossgu'  ./
    ```


## Use grep in tail command

1. The syntax of tail command is:

    ```bash
    # All the options and file names are optional.
    $ tail [OPTION]... [FILE]...
    ```

2. Use grep with pipe

    ```bash
    $ tail -100f error.log | grep 'exception'
    ```


## Regular Expressions in grep
//todo


## References
- [Common Linux Text Search](https://www.baeldung.com/linux/common-text-search)
- [GNU Grep 3.3](https://www.gnu.org/software/grep/manual/html_node/index.html)