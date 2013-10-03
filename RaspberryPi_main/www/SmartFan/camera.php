<?php
require_once 'lib.php';
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
			<p><?php printf('%02d時%1d0分頃の様子', date("H"), date("i")/10)?></p>
			<img alt="now" src="now.png" width="500px" />
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>