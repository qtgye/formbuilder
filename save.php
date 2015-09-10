<?php

	if ( isset($_POST['data']) ) {
		if (isset($_POST['data']['name'])) {
			$filename = urlencode($_POST['data']['name'] . time() . '.json');
			$new_file = fopen( $filename, 'w');
			fwrite($new_file, json_encode($_POST['data']));
			fclose($new_file);
			rename($filename , './samples/' . $filename);
		}
	}

	echo json_encode(array(
		'message' => 'Success!'
	));
?>