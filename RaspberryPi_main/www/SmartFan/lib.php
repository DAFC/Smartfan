<?php
function echoGraphList($array){
	echo '<ul>';
	foreach ($array as $key => $value){
		echo '<li><dl>';
		echo '<dt>' . $key . '</dt>';
		echo '<dd><canvas id="' . $value . '" height="200" width="500"></canvas></dd>';
		echo '</dl></li>';
	}
	echo '</ul>';
}

function echoGetData($key){
	if(!($fp=fopen("data.csv", "r"))){
		throw new ErrorException("?t?@?C???????????????B");
	}
	echo '[';
	$num = -1;
	switch ($key){
		case 'temperature':
			$num = 0;
			break;
		case 'humidity':
			$num = 1;
			break;
		case 'rpm':
			$num = 2;
			break;
	}
	if($num == -1){
		throw new ErrorException("?f?[?^??????????B");
	}
	while (($array = fgetcsv($fp,0,",")) !== FALSE){
		echo $array[$num] . ',';
	}
	echo ']';
}

$footer="&copy; 2013 豊田高専 コンピュータ部 all rights reserved.";
date_default_timezone_set('Asia/Tokyo');
?>