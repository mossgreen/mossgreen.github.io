---
title: How to Debug PHP Code
search: true
tags: 
  - PHP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---
There must be a better way. But this is the one I'm currently using.


## Find the log information

In our settings, find the following information

```php
ini_set("log_errors", "1");
ini_set("error_log", BASEDIR."log/server-error.log");
ini_set("display_errors","1");
error_reporting(E_ALL);
```

## Print out in log file

```php

error_log(__LINE__); // this will print out the line 

error_log(print_r($_YOUR_VARIABLE, TRUE)); // will print out all date in your variable
```