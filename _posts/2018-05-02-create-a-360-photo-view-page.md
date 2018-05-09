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

function isEquirectangularProject(){
  $xmpData = self::getXmpData($filename, 200);
  $parser = xml_parser_create();
  xml_parse_into_struct($parser, $xmpData, $vals, $index);
  xml_parser_free($parser);
  if (isset($vals[3]["value"]) && strtolower($vals[3]["value"]) === "equirectangular") {
      return TRUE;
  }
}

public static function getXmpData($filename, $chunkSize) {
    if (!is_int($chunkSize)) {
        throw new RuntimeException('Expected integer value for argument #2 (chunkSize)');
    }

    if ($chunkSize < 12) {
        throw new RuntimeException('Chunk size cannot be less than 12 argument #2 (chunkSize)');
    }

    if (($file_pointer = fopen($filename, 'r')) === FALSE) {
        throw new RuntimeException('Could not open file for reading');
    }

    $startTag = '<x:xmpmeta';
    $endTag = '</x:xmpmeta>';
    $buffer = NULL;
    $hasXmp = FALSE;

    while (($chunk = fread($file_pointer, $chunkSize)) !== FALSE) {

        if ($chunk === "") {
            break;
        }

        $buffer .= $chunk;
        $startPosition = strpos($buffer, $startTag);
        $endPosition = strpos($buffer, $endTag);

        if ($startPosition !== FALSE && $endPosition !== FALSE) {
            $buffer = substr($buffer, $startPosition, $endPosition - $startPosition + 12);
            $hasXmp = TRUE;
            break;
        } elseif ($startPosition !== FALSE) {
            $buffer = substr($buffer, $startPosition);
            $hasXmp = TRUE;
        } elseif (strlen($buffer) > (strlen($startTag) * 2)) {
            $buffer = substr($buffer, strlen($startTag));
        }
    }

    fclose($file_pointer);
    return ($hasXmp) ? $buffer : NULL;
}

```

## check 2:1 landscape aspect ratio

We get this information from Exif.

```php
function is2To1Ratio($filename)
{
    if (strpos(strtolower($filename), 'jpg') !== false) {

        $exif = exif_read_data($filename, 'COMPUTED');

        if (isset($exif)) {
            $photoHeight = $exif['COMPUTED']['Height'];
            $photoWidth = $exif['COMPUTED']['Width'];
            if (isset($photoHeight) && isset($photoWidth) && $photoHeight != 0 && $photoWidth / $photoHeight === 2) {
                return true;
            }
        }
    }
    return false;
}

```


