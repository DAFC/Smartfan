<?php
require_once 'lib.php';
$list=["気温"=>"temperature","湿度"=>"humidity","回転数"=>"rpm"];
?>
<html>
<head>
<title>Graph | SmartFan</title>
<link rel="stylesheet" type="text/css" href="index.css" />
<meta charset="UTF-8" />
<script type="text/javascript" src="graph.js"></script>
<script type="text/javascript">
	window.onload = function(){
		var t=new Graph("temperature",DataName.Temperature,"data.csv");
		var h=new Graph("humidity",DataName.Humidity,"data.csv");
		t.start();
		h.start();
	};
</script>

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
			<p>Smartfanが計測した各種データをリアルタイムに閲覧できます。</p>
			<p>Javascriptを使用していますので、Javascriptを有効にしてください。
		</div>

		<div id="main">
			<?php echoGraphList($list);?>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>