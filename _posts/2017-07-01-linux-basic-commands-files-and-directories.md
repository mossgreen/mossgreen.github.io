---
title: Linux Basic Commands for Files and Directories
search: true
tags: 
  - linux
toc: true
---

Essential commands to manipulate files and directories on Linux.

## 1. Create VS Delete

```bash
# Create a file
touch test.txt
mkdir -p ./testfolder/ && touch ./testfolder/test2.txt

# Delete a file
rm ./testfolder/test2.txt

# Create a directory
mkdir testfolder2
mkdir ./testfolder3
mkdir /testfolder2 #Permission denied

# Delete a directory
rmdir ./testfolder2 #Error, if directory is not empty
rm -rf ./testfolder3 # recursively, force
```

## 2. Copy VS Move

```bash
# Copy file
cp file.txt testfolder/file0.txt
cp file.txt file.txt # A and B are identical (not copied).

# Copy a directory under another directory
cp -r testfolder testfolder2

# Move files
mv file1.copy.txt file2.copy.txt # RENAME
```

## 3. Link Files and Directories

```bash
# link directory
ln ./originalfolder ./anotherfolder/somenamehere # ERRPR, should from "/" root folder
ln /homedir/originalfolder /homedir/anotherfolder/somenamehere
```

## 4. Read and Concatenate files

```bash
# Read
cat testfolder/file0.txt

# Create
cat > testfolder/file4.txt # Ctrl + c to stop

# Concatenate
cat testfolder/file0.txt testfolder/file3.txt

# Read from the first matching iterm
more +/test2 testfolder/file0.txt
```

## 5. Archive VS Extract

**tar**: Creating an archive file which contains many other files.

the switches are as follows:

- `-c = create`
- `-v = verbose`
- `-f = files`
- `-t = list contents of an archive`
- `-x = extract`
- `-r = apppend`

```bash
# Archive some files or directory to a tar file
tar -cvf testname.tar ./tutorials

# Extract files from a tar file
tar -xvf somename.tar

# View contents of a tar file
tar -tzf tutorials-master.zip.gz

# Append files to a tar file
tar -rvf somename.tar ./foldername/filename.txt

# Remove ORIGIN FILES after adding to a tar file
tar --remove-files -cvf tarfile.tar ./originfolder

# Only append files only if they are newer
tar -uvf somename.tar ./foldername/filename.txt

# Only extract files that are newer than existing files
tar --keep-newer-files -xvf tarfilename.tar
```

## Find files

```bash
# find files in current dir, name start with 'my'
find . -name 'my*'

# find files in current dir, name start with 'my' and show accesses
find . -name 'my*' -ls

# find files in current dir, type is file, updated within 10 mins
find . -type f -mmin -10
```

### Find with `xargs`

The most common usage of xargs is to use it with the find command. This uses find to search for files or directories and then uses xargs to operate on the results. Typical examples of this are

- removing files,
- changing the ownership of files or
- moving files.

Parameters:

- `-t`: prints each command
- `-p`: prints the command to be executed and prompt the user to run it.

```bash
echo 'how are you' | xargs mkdir
ls -alh
drwxr-xr-x  5 moss  staff   160B  6 Dec 20:48 .
drwxr-xr-x  7 moss  staff   224B  6 Dec 20:47 ..
drwxr-xr-x  2 moss  staff    64B  6 Dec 20:48 are
drwxr-xr-x  2 moss  staff    64B  6 Dec 20:48 how
drwxr-xr-x  2 moss  staff    64B  6 Dec 20:48 you

# The -t option prints each command, it's helpful when debugging
echo 'how are you' | xargs -t rm
ls -alh
drwxr-xr-x  5 moss  staff   160B  6 Dec 20:48 .
drwxr-xr-x  7 moss  staff   224B  6 Dec 20:47 ..
drwxr-xr-x  2 moss  staff    64B  6 Dec 20:48 are
drwxr-xr-x  2 moss  staff    64B  6 Dec 20:48 how
drwxr-xr-x  2 moss  staff    64B  6 Dec 20:48 you

# files older than two weeks in the temp folder are found and then remove them
\$ find /tmp -mtime +14 | xargs -t rm
```

## Estimating file space usage

```bash

# view a disk usage summary of a directory
du ~/projects

# view the file size of a directory
du -sh ~/projects

# sort by file or folder size, -n (numeric), -r (reverse) 
du ~/projects | sort -n -r | less

#  find the largest files on a file system
du -h . | sort -n -r | head -n 10

#  find the largest folders on a file system
du -a / | sort -n -r | head -n 10
```

Last update: Dec 2019
