---
title: Build A 360 Photo View Page
search: true
tags: 
  - PHP
  - 360 Photo
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Handle and view a 360 photo.

We'are building a web page to show 360 photos that user uploads. In this project, I'm using PHP as the backend, using **three.js** in the front end.

## How do you know it's a 360 photo?

There is not a standard rule to identify a 360 photo yet so several things we could check, like
- the make of camera, 
- photo XMP (Extensible Metadata Platform) info, 
- Exif (Exchangeable image file format) info, 
- etc.. 

In my project, the provided examples have full XMP info, and don't have much info in Exif.  After discussion, we decided to check 2 aspects.

1. ProjectionType is **equirectangular**
2. landscape aspect ratio is **2:1**

NB, if possible, I think we should also add a list of camera Make and Model. For example some popular ones. We can read this info via exif.
- RICOH - RICOH THETA S
- LG 360 CAM


## Equirectangular projection

Most of full, spherical 360 photos are equirectangular projections. This information is stored in `XMP` tag.

```php
function isEquirectangularProject() {
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
function is2To1Ratio($filename) {
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

## Create viewer page

We use an external library.

```php
<?php
/**
 * Coder source: http://www.emanueleferonato.com/2014/12/10/html5-webgl-360-degrees-panorama-viewer-with-three-js/
 * License: Didn't find license info
 *
 * Based on: https://threejs.org/
 * Licese: The MIT License
 */
$script_title    = "Panoramas Photos Viewer";
include_once 'header.inc.php';
include_once 'hints.inc.php';
?>

<style>
    canvas{
        width: 100%;
        height: 100%
    }
</style>
<script src='/js/three.min.js' type="text/javascript"></script>
<script type='text/javascript'>

    function frmInit()
    {
        var manualControl = false;
        var longitude = 0;
        var latitude = 0;
        var savedX;
        var savedY;
        var savedLongitude;
        var savedLatitude;

        // panoramas background
        var panoramaPhoto = "/common/photo?id="+<?php echo "$this->phtId";?>;

        // setting up the renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // creating a new scene
        var scene = new THREE.Scene();

        // adding a camera
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.target = new THREE.Vector3(0, 0, 0);

        // creation of a big sphere geometry
        var sphere = new THREE.SphereGeometry(100, 100, 40);
        sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        // creation of the sphere material
        var sphereMaterial = new THREE.MeshBasicMaterial();
        sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramaPhoto)

        // geometry + material = mesh (actual object)
        var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
        scene.add(sphereMesh);

        // listeners
        document.addEventListener("mousedown", onDocumentMouseDown, false);
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        document.addEventListener("mouseup", onDocumentMouseUp, false);

        render();

        function render(){

            requestAnimationFrame(render);

            // set to 0.1 to enable auto rotating
            if(!manualControl){
                longitude += 0;
            }

            // limiting latitude from -85 to 85 (cannot point to the sky or under your feet)
            latitude = Math.max(-85, Math.min(85, latitude));

            // moving the camera according to current latitude (vertical movement) and longitude (horizontal movement)
            camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.cos(THREE.Math.degToRad(longitude));
            camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - latitude));
            camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.sin(THREE.Math.degToRad(longitude));
            camera.lookAt(camera.target);

            // calling again render function
            renderer.render(scene, camera);

        }

        // when the mouse is pressed, we switch to manual control and save current coordinates
        function onDocumentMouseDown(event){

            event.preventDefault();

            manualControl = true;

            savedX = event.clientX;
            savedY = event.clientY;

            savedLongitude = longitude;
            savedLatitude = latitude;

        }

        // when the mouse moves, if in manual contro we adjust coordinates
        function onDocumentMouseMove(event){

            if(manualControl){
                longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
                latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
            }

        }

        // when the mouse is released, we turn manual control off
        function onDocumentMouseUp(event){

            manualControl = false;

        }

        // pressing a key (actually releasing it) changes the texture map
        document.onkeyup = function(event){

            sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramaPhoto);

        }
    }
</script>
<body onLoad="frmInit();">
</body>
<?php include_once 'footer.inc.php';?>
```


## References

- [Editing 360 Photos & Injecting Metadata](https://www.facebook.com/notes/eric-cheng/editing-360-photos-injecting-metadata/10156930564975277)
- [HTML5 WebGL 360 degrees panorama viewer with Three.js](http://www.emanueleferonato.com/2014/12/10/html5-webgl-360-degrees-panorama-viewer-with-three-js/)
