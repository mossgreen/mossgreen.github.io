---
title: Linux Basic Commands for Files and Directories
search: true
tags: 
  - Linux
  - Docker
toc: true
---

Essential commands to manipulate files and directories in Linux, and Mac.

### 1. Create VS Delete

```yaml
# Create a file
$ touch test.txt
$ mkdir -p ./testfolder/ && touch ./testfolder/test2.txt

# Delete a file
$ rm ./testfolder/test2.txt

# Create a directory
$ mkdir testfolder2
$ mkdir ./testfolder3
$ mkdir /testfolder2 #Permission denied

# Delete a directory
$ rmdir ./testfolder2 #Error, if directory is not empty
$ rm -rf ./testfolder3 # recursively, force
```

### 2. Copy VS Move

```yaml
# Copy file
$ cp file.txt testfolder/file0.txt
$ cp file.txt file.txt # A and B are identical (not copied).

# Copy a directory under another directory
$ cp -r testfolder testfolder2

# Move files
$ mv file1.copy.txt file2.copy.txt # RENAME

```

### 3. Link Files and Directories
    
```yaml
# link directory
$ ln ./originalfolder ./anotherfolder/somenamehere # ERRPR, should from "/" root folder
$ ln /homedir/originalfolder /homedir/anotherfolder/somenamehere
```

### 4. Read and Concatenate files
    
```yaml
# Read 
$ cat testfolder/file0.txt

# Create
$ cat > testfolder/file4.txt # Ctrl + c to stop

# Concatenate
$ cat testfolder/file0.txt testfolder/file3.txt

# Read from the first matching iterm
$ more +/test2 testfolder/file0.txt
```

### 5. Archive VS Extract

**tar**: Creating an archive file which contains many other files.

the switches are as follows:

- `-c = create`
- `-v = verbose`
- `-f = files`
- `-t = list contents of an archive`
- `-x = extract`
- `-r = apppend`

```yaml

# Archive some files or directory to a tar file
$ tar -cvf testname.tar ./tutorials

# Extract files from a tar file
$ tar -xvf somename.tar

# View contents of a tar file
$ tar -tzf tutorials-master.zip.gz

# Append files to a tar file
$ tar -rvf somename.tar ./foldername/filename.txt

# Remove ORIGIN FILES after adding to a tar file
$ tar --remove-files -cvf tarfile.tar ./originfolder

# Only append files only if they are newer
$ tar -uvf somename.tar ./foldername/filename.txt

# Only extract files that are newer than existing files
$ tar --keep-newer-files -xvf tarfilename.tar

# Others
$man tar
$tar --help
```


