<?php

return [

    /*
    | Story photos are re-encoded on upload (strips EXIF and GPS data) and
    | scaled to fit inside this box. Which disk they land on is set by
    | `filesystems.photos` (PHOTOS_DISK).
    */

    'driver' => env('PHOTOS_IMAGE_DRIVER', 'gd'), // gd or imagick

    'max_width' => (int) env('PHOTOS_MAX_WIDTH', 1600),

    'max_height' => (int) env('PHOTOS_MAX_HEIGHT', 1600),

    'quality' => (int) env('PHOTOS_JPEG_QUALITY', 82),

];
