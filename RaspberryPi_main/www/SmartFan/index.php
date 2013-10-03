<?php
require_once 'lib.php';
?>
<html>
<head>
<title>Welcome to the Smartfan</title>
<?php require_once 'CSS.php';?>
<meta charset="UTF-8" />
</head>

<body>

	<div id="wrap">

		<?php require_once 'header.html';?>
		
		<div id="bar">
			<p>Smartfanを外部から制御することができます。また、Smartfanが計測した情報をリアルタイムに閲覧することができます。</p>
			<p>表示はInternetExplorer11 Firefox24 GoogleChrome29で確認しています。</p>
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