<?php
require_once 'lib.php';
?>
<html>
<head>
<title>Sleep | SmartFan</title>
<meta charset="UTF-8" />
<?php require_once 'CSS.php';?>
<script type="text/javascript" src="sleep.js"></script>
<script type="text/javascript">
	window.onload = function(){
		var m = new Maneger('makedTask', 'result');
		m.Start();
	}
</script>
</head>

<body>

	<div id="wrap">

		<?php require_once 'header.html';?>
		
		<div id="bar">
			<p>このページを開いたまま寝ることで、Smartfanは自動で睡眠にやさしい風を届けます。</p>
			<p>Javascriptを使用していますので、Javascriptを有効にしてください。 </p>
		</div>

		<div id="main">
			<h2>Sleep</h2>
			<input type="checkbox" id="isSleep" /><label for="isSleep">機能使用</label>
			<p><div id='makedTask'></div></p>
			<p><div id='result'></div></p>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>