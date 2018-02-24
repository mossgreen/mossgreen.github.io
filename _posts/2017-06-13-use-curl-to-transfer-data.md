---
title: Use cURL to Transfer Data
search: true

tags: 
  - Linux
  - cURL
toc: true
---

cURL is a command line tool for getting or sending files using URL syntax.

### 1. To retrieve a page 

```
# Retrieve the whole site
curl www.example.com

# Retrive Header**
curl -i www.example.com
```
  
### 2. Write the out put

```
curl -o example.html www.example.com
```
    
### 3. User Agent


```
# User Agent
curl -A "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)" -x 123.45.67.89:1080 -o page.html -D cookie0001.txt http://www.yahoo.com 

# Referer
curl -A "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)" -x 123.45.67.89:1080 -e "mail.yahoo.com" -o page.html -D cookie0001.txt http://www.yahoo.com
```
    
### 4. Download files

```
curl -O http://cgi2.tky.3web.ne.jp/~zzh/screen[1-10].JPG  

# With username and password
curl -u name:passwd ftp://ip:port/path/file  
```

### 5. Play with form
```
# Get
$ curl example.com/form.cgi?data=xxx

# Post
$ curl -X POST --data "data=xxx" example.com/form.cgi
```

### 6. Upload files

Example of the form:

```
<form method="POST" enctype='multipart/form-data' action="upload.cgi">
<input type=file name=upload>
<input type=submit name=press value="OK">
</form>
```

Upload file

```
$ curl --form upload=@localfilename --form press=OK [URL]
```

### 7. Other tips

  - To run a command silently: `curl -s -O <URL>`
  - Follow redirects, add "-L": `curl -OL <URL> `
  - Reduce The Download Rate in a poor connection: `curl -O --limit-rate 1m <URL>`


### 8. TODOS

1. Compare with **Wget** and **telnet**
2. Add more demos


### References
 
 1. https://www.youtube.com/watch?v=7XUibDYw4mc
 2. http://www.ruanyifeng.com/blog/2011/09/curl.html
 3. https://otar.im/post/562905ff2b0af28c74d5a086
