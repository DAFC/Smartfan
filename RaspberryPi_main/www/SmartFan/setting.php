<?php
require_once 'lib.php';
?>
<html>
<head>
<title>Setting | SmartFan</title>
<meta charset="UTF-8" />
<?php require_once 'CSS.php';?>
</head>

<body>

	<div id="wrap">

		<?php require_once 'header.html';?>
		
		<div id="bar">
			<p>Smartfanに関する、各種設定ができます。</p>
		</div>

		<div id="main">
			<h2>Setting</h2>
			<?php
				$isBotFile = "../../scripts/isBot";
				$isCameraFile= "../../scripts/isCamera";
				if(isset($_POST['smartfanSubmit'])){
					if(isset($_POST['isBot'])){
						$fp = fopen($isBotFile, "w");
						fwrite($fp, "SmartfanIsTwitterBot");
						fclose($fp);
					}else{
						if(file_exists($isBotFile)){
							unlink($isBotFile);
						}
					}
					if(isset($_POST['isCamera'])){
						$fp = fopen($isCameraFile, "w");
						fwrite($fp, "SmartfanIsCamera");
						fclose($fp);
					}else{
						if(file_exists($isCameraFile)){
							unlink($isCameraFile);
						}
					}
					echo "<p class=\"result\">設定しました</p>";
				}
			?>
			<form name="smartfan" method="post" action="setting.php">
				<h3>Smartfanの設定</h3>
				<input type="checkbox" name="isBot" <?php if(file_exists($isBotFile)){ echo "checked"; } ?> />Twitterへの自動投稿を有効にする<br />
				<input type="checkbox" name="isCamera" <?php if(file_exists($isCameraFile)){ echo "checked"; } ?> />自動撮影を有効にする<br />
				<input type="submit" name="smartfanSubmit" value="送信" />
			</form>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>

</body>
</html>