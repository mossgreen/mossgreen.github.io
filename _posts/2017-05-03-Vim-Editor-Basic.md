---
title: Vim Editor 101
search: true

header:
  image:  assets/images/how-to-quit-vim.png
  --teaser: assets/images/how-to-quit-vim.png
tags: 
  - Linux
  - Vim
toc: true
---

How to quit vim? - -!

## It has Dual-mode
- GUI
- Editor


## GUI Mode

### move
  - "H" moves left; 
  - "K" moves up; 
  - "L" moves right; 
  - "J" moves down.

### Copy & Paste
- "Y" copies a line of text to the buffer.
- "yy" copies a whole line of text.
- "P" pastes it to the cursor's current position.
- "D" delete whole line and buffer
- "dd" delete whole line and buffer 
- "xN"+ enter, will do
- ":" go to specific line: ":13"
- Search and text replace: ":%s/Jack/John/g"
- "/" find, like "/moss"
- "u" for undo last command
- ":w" save
- ":wq" save and quit
- ":q!" quit without save


## Editor Mode

- "i" to begin inserting text at the current cursor position
- "a" to begin inserting after the current cursor position
- `escape` to quit editor mode


## Settings

find settings at `~/.vimrc`

- ":syntax on" color theme
- "colorscheme "+ tag, to change theme
- "vim ftp:////". For example: "vim ftp://172.16.15.73//Users/john/test.pl"


## Scenarioes

### Empty a file:
1. Go to command mode in the editor by pressing `ESC` key on the keyboard.
2. Press `gg`. It will take to the first line of the file.
3. Then press `dG`. This will delete from the first line to the last line.

## References
- [Learning The Vi And Vim Editors, 7th Edition.pdf](https://www.amazon.com/Learning-Vim-Editors-Processing-Maximum/dp/059652983X)
- [vim tips and tricks](https://www.cs.oberlin.edu/~kuperman/help/vim/searching.html)