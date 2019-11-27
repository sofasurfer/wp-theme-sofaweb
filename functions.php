<?php


if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}



/**
 * Theme includes
 *
 * Includes all files from the library directory.
 */
$dir = plugin_dir_path(__FILE__) . 'components';
foreach(new DirectoryIterator($dir) as $fileinfo) {
  if(!$fileinfo->isDot() && !$fileinfo->isDir() && substr($fileinfo->getFilename(), 0, 1) != '.') {
    $file = basename(dirname($fileinfo->getRealPath())) . '/' . $fileinfo->getFilename();
    require_once $file;
  }
}
unset($dir, $fileinfo, $file);

