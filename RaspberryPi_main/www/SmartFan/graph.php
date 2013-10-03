<?php
require_once 'lib.php';
$list=["気温"=>"temperature","湿度"=>"humidity"];
?>
<html>
<head>
<title>Graph | SmartFan</title>
<?php require_once 'CSS.php';?>
<meta charset="UTF-8" />
<script type="text/javascript" src="graph.js"></script>
<script type="text/javascript">
	window.onload = function(){
		var t = new Graph("temperature", 0, "data.csv", "℃");
		var h = new Graph("humidity", 1, "data.csv", "％");
		t.Start();
		h.Start();
	};
</script>

</head>

<body>

	<div id="wrap">

		<?php require_once 'header.html';?>
		
		<div id="bar">
			<p>Smartfanが計測した各種データをリアルタイムに閲覧できます。</p>
			<p>Javascriptを使用していますので、Javascriptを有効にしてください。</p>
			<p>横軸で何も数字がついていないものは0.1の目盛です。</p>
			<p>30分毎に縦軸を表示しています。</p>
		</div>

		<div id="main">
			<h2>Graph</h2>
			<?php
				echo '<ul>';
				foreach ($list as $key => $value){
					echo '<li><dl>';
					echo '<dt><p>' . $key . ':現在 <span id="' . $value . '_data">Unknown</span></p></dt>';
					echo '<dd><canvas id="' . $value . '" height="200" width="500"></canvas></dd>';
					echo '</dl></li>';
				}
				echo '</ul>';
			?>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>