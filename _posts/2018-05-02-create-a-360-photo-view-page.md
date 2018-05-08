---
title: Create a 360 photo view page
search: true
tags: 
  - PHP
  - Photo
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
We'are building a web page to show 360 photos that user uploads. Here are my notes about it. In this project, I'm using PHP as the backend, using **three.js** in the front end.

## How do you know it's a 360 photo?

There're several things we could check whether it's a 360 photo, like the make of camera, photo XMP(Extensible Metadata Platform)  info, Exif(Exchangeable image file format) info, etc.. In my project, the provided examples have full XMP info, and don't have much info in Exif.  After discussion, we decided to check 2 aspects.
1. Equirectangular projection
2.  2:1 landscape aspect ratio

### Equirectangular projection
Most of full, spherical 360 photos are equirectangular projections. This information is stored in XMP tag.

```php
$xmpData = self::getXmpData($filename, 200);
$parser = xml_parser_create();
xml_parse_into_struct($parser, $xmpData, $vals, $index);
xml_parser_free($parser);
if (isset($vals[3]["value"]) && strtolower($vals[3]["value"]) === "equirectangular") {
    return TRUE;
}
```

## check 2:1 landscape aspect ratio


