---
title: Parsing JSON using jq
search: true
tags: 
  - Bash
  - jq
  - Json
  - Curl
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Parse JSON using jq in the bash command line.

## My challenge

- Got a Json from curl get request
- Image base64 is nested in
- I need to get the base64 and convert it to an image

Here is an example Json

```json
{
   "id":"001",
   "image":{
      "full_size":{
         "data":"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII="
      },
      "half_size":{
         "data":"iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAQAAAAnZu5uAAAAEElEQVR42mNk+M8ABYwkMAGbQQUBEvGWBAAAAABJRU5ErkJggg=="
      }
   }
}
```

## The solution

```bash
curl -H "Authorization: Basic myCredentialis" https://togetmyjsonurl.com/getjson | jq -r '.["image"]["full_size"]["data"]' | base64 --decode > randomfilename.jpg
```

### jq - Command-line JSON processor

In the above example, we got the Json from curl, then we parse it using `jq`, dive 3 levels deep into the Json and arrives at the front door of what we seek.

```bash
$ brew update
$ brew install jq
$ which jq
$ man jq
```

### curl - transfer a URL

```bash
$ which curl
$ man curl
```

### base64 -- Encode and decode using Base64 representation

```bash
$ which base64
$ man base64
```

## jq Details

Let's move on with the same example.

### 1. The pipe operator

The `|` operator in `jq` feeds the output of one filter.

### 2. Get all the keys

```bash
$ resulttext | jq 'keys | .[]''
"id"
"image"
```

### 3.  get all the values

```bash
$ resulttext | jq '.[]''
"001"
{
  "full_size": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII="
  },
  "half_size": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAQAAAAnZu5uAAAAEElEQVR42mNk+M8ABYwkMAGbQQUBEvGWBAAAAABJRU5ErkJggg=="
  }
}
```

### 4.  get one from key:

```bash
$ resulttext | jq '.image''
{
  "full_size": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII="
  },
  "half_size": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAQAAAAnZu5uAAAAEElEQVR42mNk+M8ABYwkMAGbQQUBEvGWBAAAAABJRU5ErkJggg=="
  }
}
```

### 5.  Get length

- String: length in bytes
- array: number of elements
- Objects: number of key-value pairs
- length of null is 0

```bash
$ resulttext | jq '.image |  length'
2
```

### 6.  Go deeper

```bash
$ resulttext | jq  '.image.full_size.data'
"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII="
```

### 7.  Without Quotes

```bash
$ resulttext | jq -r '.image.full_size.data'
"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII="
```

`-r` stands for `--raw-output`.

I got an error with `.`, so this example could be:

```bash
$ resulttext | jq -r '.["image"]["full_size"]["data"]'
iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=
```

## References

- [jq Manual GitHub Page](https://stedolan.github.io/jq/manual/)
- [Parsing JSON with jq](http://www.compciv.org/recipes/cli/jq-for-parsing-json//)
- [Working with JSON in bash using jq](https://cameronnokes.com/blog/working-with-json-in-bash-using-jq/)
- [HTTP to HTTP with bash, curl and jq](https://oncletom.io/2016/pipelining-http/)