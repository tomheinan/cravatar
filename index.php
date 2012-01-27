<?php
/**
 * cravatar by tom (http://tomheinan.com)
 * v1.0.2
 */

define('MAX_CACHE_AGE', 14400); // four hours
define('SKIN_URL', "http://s3.amazonaws.com/MinecraftSkins/");
$request_uri = $_SERVER['REQUEST_URI'];

$matches = array();
$username;
$size;
if (preg_match("/^\/([A-Za-z0-9\_]+)\/?(\d*)\/?$/", $request_uri, $matches)) {
	$username = $matches[1];
	if (count($matches) > 2 && $matches[2] != "") {
		if (intval($matches[2]) < 8) {
			$size = 8;
		} else if (intval($matches[2]) <= 256) {
			$size = intval($matches[2]);
		} else {
			$size = 256;
		}
	} else {
		$size = 16;
	}
} else {
	header('Status: 400 Bad Request');
	header('Content-Type: text/plain; charset=utf-8');
	die("Error: malformed URI.  Please use the format http://cravatar.tomheinan.com/<username>/<size>, where 8 ≤ size ≤ 256.");
}

header("Content-type: image/png");

// get the user's current minecraft skin
$original;
$cached_file = 'cache/'.$username.'.png';

// if the current file is older than the maximum cache age, clear it
if (file_exists($cached_file)) {
	$creation_time = filemtime($cached_file);
	if ((time() - $creation_time) >= MAX_CACHE_AGE) {
		unlink($cached_file);
	}
}

if (file_exists($cached_file)) {
	$original = imagecreatefrompng($cached_file);
} else {
	$hh = curl_init(SKIN_URL.$username.'.png');
	curl_setopt($hh, CURLOPT_NOBODY, true);
	curl_exec($hh);
	$status_code =  curl_getinfo($hh, CURLINFO_HTTP_CODE);
	
	if ($status_code < 400) {
		// the user has a custom skin - let's cache it
		$fp = fopen($cached_file, 'w');

		$ch = curl_init(SKIN_URL.$username.'.png');
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_FILE, $fp);

		curl_exec($ch);

		curl_close($ch);
		fclose($fp);

		$original = imagecreatefrompng($cached_file);
	} else {
		// the user doesn't have a custom skin - use the default
		header('Status: 203 Non-Authoritative Information');
		$original = imagecreatefrompng("default.png");
	}
	curl_close($hh);
}

// create a new image to retun to the user
$cravatar = imagecreatetruecolor($size, $size);

imagecopyresized($cravatar, $original, 0, 0, 8, 8, $size, $size, 8, 8);
imagecopyresized($cravatar, $original, 0, 0, 40, 8, $size, $size, 8, 8);
imagedestroy($original);

imagepng($cravatar);
imagedestroy($cravatar);
?>
