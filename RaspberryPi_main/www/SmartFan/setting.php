<?php
require_once 'lib.php';
?>
<html>
<head>
<title>Setting | SmartFan</title>
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
			<p>Smartfanに関する、各種設定ができます。</p>
		</div>

		<div id="main">
			<form name="smartfan" action="setting.php">
				<p>smartfan</p>
				<input type="checkbox" name="isBot" />Twitterへの投稿を有効にする
				<input type="submit" name="smartfanSubmit" value="送信" />
			</form>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>