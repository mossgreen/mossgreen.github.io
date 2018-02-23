---
title: How to Quit Vim and Do Other Things?
tags: 
  - Linux
  - Vim
header:
  teaser: "assets/images/how-to-quit-vim.png"
toc: true
author: Moss GU
---

Me too, jsut learning Vim from quiting it.

It has Dual-mode: GUI and Editor.

### GUI

- "H" moves left; 
- "K" moves up; 
- "L" moves right; 
- "J" moves down.
---
- "Y" copies a line of text to the buffer.
- "yy" copies a whole line of text.
- "P" pastes it to the cursor's current position.
- "D" delete whole line and buffer
- "dd" delete whole line and buffer 
---
- "xN"+ enter, will do
---
- ":" go to specific line: ":13"
- Search and text replace: ":%s/Jack/John/g"
---
- "/" find, like "/moss"
---
- "u" for undo last command
- ":w" save
- ":wq" save and quit
- ":q!" quit without save
---

### Editor

- "i" to begin inserting text at the current cursor position
- "a" to begin inserting after the current cursor position
- `escape` to quit editor mode

### Settings

- ":syntax on" color theme
- "colorscheme "+ tag, to change theme
--- "vim ftp:////". For example: "vim ftp://172.16.15.73//Users/john/test.pl"


find settings at `~/.vimrc`


