<?php
require_once 'lib.php';
?>
<html>
<head>
<title>Welcome to the Smartfan</title>
<link rel="stylesheet" type="text/css" href="index.css" />
<meta charset="UTF-8" />
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
			<p>Smartfanを外部から制御することができます。また、Smartfanが計測した情報をリアルタイムに閲覧することができます。</p>
			<p>表示はInternetExplorer11 Firefox23 GoogleChrome29で確認しています。</p>
		</div>

		<div id="main">
			<h2>Home</h2>
			<p>Smartfan コントロールパネルへようこそ</p>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>