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

## Why I want to use Linux grep

1. I want to search a text in file.
2. I want to know the files that contains a key word.
3. I want to know the key works in the files.

## About grep

`grep` is a powerful file pattern searcher in Linux.

`grep` stands for "global regular expression print". It processes text line by line and prints any lines which match a specified pattern.

It can accept standard input as a parameter.

### Install grep

```bash
\$ sudo apt-get install grep         # Debian/Ubuntu

\$ sudo yum install grep             # RHEL/CentOS/Fedora

\$ whereis grep                      #/usr/bin/grep
```

### Parameters

1. case insensitive `-i`

2. pass in regex `–e`

3. only show counts `-c`

4. only print the file name `-I`

5. only print the file name that doesn't match `-L`

6. match whole world rather then part of string `-w`

7. search directories recursivly  `-r`

8. show line number `-n`

9. show if don't match `-v`

10. show following lines `-A`

11. show lines prior the pattern `-B`

12. disply matched patter in colours `--color`

## Search in one file

1. Search a string in a file

    ```bash
    \$ grep 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    ```

    ![IMAGE](https://i.loli.net/2019/10/16/uNFgyp8TnxBUrDo.jpg)

    It returns all the lines that contain given string.

2. Search a string in a file case insensitive `-i`

    ```bash
    \$ grep -i 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    ```

    ![IMAGE](https://i.loli.net/2019/10/16/FYlMNvGwzZJorRB.jpg)

    It returns all the lines that contain given string insensitive.

3. Search a string as a whole word `-w`

    ```bash
    \$ grep -w -i 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    ```

    ![IMAGE](https://i.loli.net/2019/10/16/1t5Tr6snafwziKN.jpg)

    It returns only the whole words.

4. Count the Matching Lines

    ```bash
    \$ grep -Fc 'moss' .//_site/Java-Bean-VS-Spring-Bean/index.html
    6
    ```

    grep is a line-based search utility. The `-c` option will output the count of matched lines instead of the count of pattern occurrences.

5. Grep in `ls`

    ```bash
    \$ ls -lt | grep 'Feb 28 2046'
    ```

## Search in Directories

1. in current directory, find all `.md` files that contains 'text' and print out the line

    ```bash
    \$ grep test *md
    CHANGELOG.md:* Remove `base_path` include from `/test` pages.
    CHANGELOG.md:* Test strict Front Matter in `/test` site. [#1236](https://github.com/mmistakes/minimal-mistakes/pull/1236)
    ```

2. find all files that contain some pattern.

    ```bash
    \$ grep -Rl 'mossgu'  ./
    ```

    Use the `-l` option to skip the matching information and let grep print only the file names of matched files.

3. list how many times a string shows in each file

    ```bash
    \$ grep -RlFc 'mossgu'  ./
    ```

4. find all lines that **don't** have the given pattern

    ```bash
    \$ grep -v test *md*
    ```

## Regular Expressions in grep

1. `*`: all chars, length could be 0,

    ```bash
    \$ grep 'text' d* # match all fiels name starts with d and contains 'test'
    ```

2. `^`: regex starts with

    ```bash
    \$ grep '^root' ./ # match 'root::0:root`, not 'mail::6:root'
    ```

3. `$` regex ends with

    ```bash
    \$ grep 'root$' ./ #match 'mail::6:root', not 'tty::7:root,tty,adm'
    ```

4. `\<`  start of the pattern # '\<moss' starts with 'moss'

5. `\>`  end of the pattern # 'moss\>' ends with 'moss'

6. `\bmoss\b` # only 'moss'

## Docker logs with grep

`grep` doesn't work on docker logs command: `docker logs nginx | grep "error"`.
Because `docker logs` doesn't send output to standard output. piping works only for stdout. Try:

```bash
\$ docker logs nginx 2>&1 | grep "error"
```

## Scenarios

### 1. I have a very big log file and try to find the line that in a certain time

```bash
\$ grep -n '2019-10-24 00:01:11' *.log
```

### 2. find from root, all the log files and contians 'ERROR'

```bash
\$ find / -type f -name "*.log" | xargs grep "ERROR"
```

### 3. from current directory, find all `.in` files and contains 'tomcat'

```bash
\$ find . -name "*.in" | xargs grep "tomcat"
```

### 4. match part or whole world

```bash
\$ grep man *  #match batman, manic, man
\$ grep '\<man' * #match manic, man, not batman
\$ grep '\<man\>' * #match man, not batman manic

```

### 5. find all empty lines

```bash
\$ grep ^$ /etc
```

### 6. find multiple patterns

```bash
\$ grep -e 'hi' -e 'moss' ./ # match either of them
```

### 7. show the matching line and the following 100 lines

```bash
\$ grep -A100 Error ./
```

### 8. show the matching line and 100 lines prior

```bash
\$ grep -B100 Error ./
```

### 9. print system thread and find usefule info

```bash
\$ ps -ef | grep 'postgres' -i
```

### 10. in git blame find the line 400

```bash
\$ git blam main.js | grep 400
```

### 11. find very big files on the server

``` bash
\$ df -h
Filesystem      Size   Used  Avail Capacity iused               ifree %iused  Mounted on
/dev/disk1s1   234Gi  186Gi   45Gi    81% 2232606 9223372036852543201    0%   /
devfs          346Ki  346Ki    0Bi   100%    1197                   0  100%   /dev
/dev/disk1s4   234Gi  2.0Gi   45Gi     5%       2 9223372036854775805    0%   /private/var/vm
map -hosts       0Bi    0Bi    0Bi   100%       0                   0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%       0                   0  100%   /home

\$ df -h | grep 'G' -n
2:/dev/disk1s1   234Gi  186Gi   45Gi    81% 2232606 9223372036852543201    0%   /
4:/dev/disk1s4   234Gi  2.0Gi   45Gi     5%       2 9223372036854775805    0%   /private/var/vm
```

## References

- [Common Linux Text Search](https://www.baeldung.com/linux/common-text-search)
- [GNU Grep 3.3](https://www.gnu.org/software/grep/manual/html_node/index.html)

last update: Nov 2019
