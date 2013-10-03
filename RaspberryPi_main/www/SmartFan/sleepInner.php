<?php
if(array_key_exists('command', $_POST)&&array_key_exists('value', $_POST)){
	if(makeTask($_POST['command'] . ' ' . $_POST['value'])){
		echo '通信しました--' . $_POST['command'] . ' ' . $_POST['value'];
	}
}

function makeTask($string){
	$string = $string . ';';
	if(file_exists("task")){
		//fail
		return false;
	}else{
		mkdir("task");
		$taskFile = fopen("task/task.t", 'w');
		fwrite($taskFile, $string);
		fclose($taskFile);
		return true;
	}
}
?>