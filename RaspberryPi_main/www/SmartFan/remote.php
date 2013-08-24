<?php
require_once 'lib.php';

function makeTask($string){
	$string = $string . ';';
	if(file_exists("task")){
		//fail
		return false;
	}else{
		mkdir("task");
		$taskFile = fopen("task/task.txt", 'w');
		fwrite($taskFile, $string);
		fclose($taskFile);
		return true;
	}
}
//do python serial
?>
<html>
<head>
<title>Remote | SmartFan</title>
<meta charset="UTF-8" />
<link rel="stylesheet" type="text/css" href="index.css" />
</head>

<body>

	<div id="wrap">

		<header>
			<h1>Smartfan</h1>
		</header>

		<div id="navi">
			<?php require 'navi.html'; ?>
		</div>
		
		<div id="bar">
			<p>Smartfanを外部から制御することができます。</p>
			<p>Smartfanを経由して、エアコンの設定をすることもできます。</p>
		</div>

		<div id="main">
			<?php
				if(isset($_POST['powerSubmit'])){
					if(preg_match("/^\-?\d+(\.?\d+)?/", $_POST['power'])){
						$power = (float)$_POST['power'];
						if (0 <= $power && $power <= 100) {
							if(makeTask("Power " . $power)){
								echo "<p>風量を" . $power . "％に設定しました</p>";
							}else{
								echo "<p>power task failed</p>";
							}
						}else {
							echo "<p>bad value @power</p>";
						}
					}else {
						echo "<p>not numeral @power</p>";
					}
				}elseif(isset($_POST['temperatureSubmit'])) {
					if(preg_match("/^\-?\d+(\.?\d+)?/", $_POST['temperature'])){
						$temperature = (float)$_POST['temperature'];
						if (25 <= $temperature && $temperature <= 30) {
							if(makeTask("Temperature " . $temperature)){
								echo "<p>エアコン温度を" . $temperature . "度に設定しました</p>";
							}else{
								echo "<p>remote task failed</p>";
							}
						}else {
							echo "<p>bad value @remote</p>";
						}
					}else {
						echo "<p>not numeral @remote</p>";
					}
				}elseif(isset($_POST['degreeSubmit'])){
					if(preg_match("/^\-?\d+(\.?\d+)?/", $_POST['degree'])){
						$degree = (float)$_POST['degree'];
						if (-45 <= $degree && $degree <= 45) {
							if(makeTask("Degree " . $degree)){
								echo "<p>Smartfanの角度を" . $degree . "度に設定しました</p>";
							}else{
								echo "<p>degree task failed</p>";
							}
						}else {
							echo "<p>bad value @degree</p>";
						}
					}else {
						echo "<p>not numeral @degree</p>";
					}
				}else {
					//nothing
				}
			?>
			<form name="power" method="post" action="remote.php">
				<p>風量(0.0 -- 100.0)</p>
				<input type="number" name="power" min="0" max="100" />
				<input type="submit" name="powerSubmit" value="送信" />
			</form>
			<form name="remote" method="post" action="remote.php">
				<p>エアコン連動(25.0 -- 30.0)</p>
				<input type="number" name="temperature" min="25" max="30" />
				<input type="submit" name="temperatureSubmit" value="送信" />
			</form>
			<form name="remote" method="post" action="remote.php">
				<p>Smartfan角度(-45.0 -- 45.0)</p>
				<input type="number" name="degree" min="-45" max="45" />
				<input type="submit" name="degreeSubmit" value="送信" />
			</form>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>