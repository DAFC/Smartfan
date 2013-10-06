<?php
require_once 'lib.php';

$recent = "0";
foreach(glob("pict/*.jpg") as $filename){
	$date = substr($filename, 5, 12);
	if($recent < $date){
		$recent = $date;
	}
}

//yyyymmddhhmm.jpg
$year = substr($recent, 0, 4);
$month = substr($recent, 4, 2);
$day = substr($recent, 6, 2);
$hour = substr($recent, 8, 2);
$minute = substr($recent, 10, 2);
?>
<html>
<head>
<title>Camera | SmartFan</title>
<meta charset="UTF-8" />
<?php require_once 'CSS.php';?>
</head>

<body>

	<div id="wrap">

		<?php require_once 'header.html';?>
		
		<div id="bar">
			<p>Smartfanが撮影した画像が表示されます。</p>
			<p>画像は10分ごとに更新されます。</p>
		</div>

		<div id="main">
			<h2>Camera</h2>
			<p><?php printf('%02d時%02d分頃の様子', $hour, $minute)?></p>
			<img alt="写真を撮るように設定していないか、画像が表示できません。" src="pict/<?php echo $recent ?>.jpg" width="500px" />
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>