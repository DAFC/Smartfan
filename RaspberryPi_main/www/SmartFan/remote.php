<?php
require_once 'lib.php';

$actionList=array(
	array('value'=>'OnProgram', 'description'=>'起動'),
	array('value'=>'OffProgram', 'description'=>'終了'),
	array('value'=>'PowerProgram', 'description'=>'風量'),
	array('value'=>'SwingProgram', 'description'=>'首振り')
);
/*
起動(分
終了(分
強さ(弱中強,心地よい風のサイクル)
首振り(On,Off)
*/

function makeTask($string){
	$string = $string . ';';
	if(file_exists("task")){
		//fail
		return false;
	}else{
		mkdir("task");
		$taskFile = fopen("task/task.t", 'w');
		fwrite($taskFile, $string);
		fclose($taskFile);
		return true;
	}
}

function makeTimerTask($programName, $stringArray){
	for($i = 0; $i<count($stringArray); $i++){
		$query = explode("_", $stringArray[$i]);
		$string = $query[0] . "|";
		if($query[1] === "OnProgram"){
			$string = $string . "Switch 1;";
		}else if($query[1] === "OffProgram"){
			$string = $string . "Switch 0;";
		}else if($query[1] === "PowerProgram"){
			$power = 0;
			if($query[2] === "low"){
				$power = 50;
			}else if($query[2] === "middle"){
				$power = 75;
			}else if($query[2] === "high"){
				$power = 100;
			}else if($query[2] === "rhythm"){
				$power = -1;
			}
			$string = $string . "Power " . $power . ";";
		}else if($query[1] === "SwingProgram"){
			$string = $string . "Swing " . ($query[2]==="On"?"1":"0") . ";";
		}
		$stringArray[$i] = $string;
	}
	
	$writeString = join("\n", $stringArray);
	
	if(file_exists("timerTask")){
		return false;
	}else{
		mkdir("timerTask");
		$timerTaskFile = fopen("timerTask/" . time() . "_" . $programName . ".t", 'w');
		fwrite($timerTaskFile, $writeString);
		fclose($timerTaskFile);
		return true;
	}
}

?>
<html>
<head>
<title>Remote | SmartFan</title>
<meta charset="UTF-8" />
<link rel="stylesheet" type="text/css" href="index.css" />
<script type="text/javascript" src="lib.js"></script>
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
			<p>Javascriptを使用していますので、Javascriptを有効にしてください。 </p>
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
					
				}elseif(isset($_POST['deleteProgramSubmit'])){
					$toDeleteProgram = preg_replace("/EditProgram\('(.*)'.'.*'\)/", "$1", $_POST['selectedSavedProgram']);
					unlink("SmartfanProgram/" . $toDeleteProgram . ".sp");
					echo "<p>プログラム \"" . $toDeleteProgram . "\" を削除しました。</p>\n";
					
				}elseif(isset($_POST['saveProgramSubmit'])){
					$isOverwrite = file_exists("SmartfanProgram/" . $_POST['saveProgramName'] . ".sp");
					$fp = fopen("SmartfanProgram/" . $_POST['saveProgramName'] . ".sp", "w+");
					fwrite($fp, join("\n", $_POST['toDoList']));
					fclose($fp);
					echo "<p>プログラム \"" . $_POST['saveProgramName'] . "\" を" . ($isOverwrite?"上書き":"") ."保存しました。</p>\n";
					
				}elseif(isset($_POST['sendProgramSubmit'])){
					if(makeTimerTask($_POST['saveProgramName'] ,$_POST['toDoList'])){
						echo "<p>プログラム \"" . $_POST['saveProgramName'] . "\" を送信しました。</p>\n";
					}else{
						echo "<p>既に他のプログラムが実行されています。</p>\n";
					}
					
				}elseif(isset($_POST['cancelProgramSubmit'])){
					$fp = @opendir("timerTask");
					while(($item = readdir($fp)) !== false){
						if($item !== "." && $item !== ".."){
							unlink("timerTask/" . $item);
						}
					}
					rmdir("timerTask");
					echo "<p>プログラムを中断しました。</p>";
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
			<form name="program" method="post" action="remote.php" onkeydown="if(event.keyCode==13)return false;">
				<p>Smartfan プログラム</p>
				<select id="actionList" name="actionList" style="width:200px" onchange="actionListChanged()">
					<option value="" id="actionListDefault" selected>---- 命令を選んでください ----</option>
					<?php
						foreach($actionList as $child){
							echo '<option value="' . $child['value'] . '">' . $child['description'] . '</option>' . "\n";
						}
					?>
				</select>
				<span id="dynamicControl"></span>
				<input type="number" id="minute" name="minute" min="0" value="0" style="width:40px;"/>分後
				<input type="button" value="セット" onclick="AddToDoList()" style="width:45px;" /><br />
				<select id="toDoList" name="toDoList[]" size="5" style="width:200px" multiple>
				</select>
				<input type="button" value="削除" onclick="DeleteToDoListItem()" />
				<select id="savedProgramList" name="selectedSavedProgram" size="5" style="width:180px" onchange="savedProgramListChanged()" ondblclick="document.getElementById('savedProgramList').selectedIndex = -1;document.getElementById('saveProgramName').value = '';">
					<?php
						foreach(glob('SmartfanProgram/*.sp') as $p){
							$name = preg_replace("/SmartfanProgram\/(.*)\.sp/","\\1", $p);
							$line = preg_replace("/(\r\n|\n\r|\r|\n)/","|", file_get_contents($p));
							printf("<option value=\"EditProgram('%s','%s')\">%s</option>\n", $name, $line, $name);
						}
					?>
				</select>
				<input type="submit" name="deleteProgramSubmit" value="削除" onclick="if(document.getElementById('savedProgramList').selectedIndex < 0){alert('削除するプログラムを選択してください。');return false;}"/><br />
				プログラム名:<input id="saveProgramName" name="saveProgramName" type="text" style="width:180px;"/>
				<input type="submit" name="saveProgramSubmit" value="保存" onclick="return saveProgramSubmitClicked()" />
				<input type="submit" name="sendProgramSubmit" value="送信" onclick="return sendProgramSubmitClicked()" />
				<p>現在稼働中のプログラム:
					<?php
						if(file_exists("timerTask")){
							$task = glob('timerTask/*.t')[0];
							$taskFile = file($task, FILE_SKIP_EMPTY_LINES);
							$lastLine = array_pop($taskFile);
							$taskInfo = preg_split("/[\/_.]/", $task);
							$taskTime = $taskInfo[1] + explode("|", $lastLine)[0] * 60;//*60second
							$taskName = $taskInfo[2];
							echo $taskName;
							echo " 終了予定時刻:";
							echo date("H:i",$taskTime);
						}else{
							echo "なし";
						}
					?>
				</p>
				<input type="submit" name="cancelProgramSubmit" value="現在動作中のプログラムを今すぐ中止" />
			</form>
		</div>

		<footer>
			<p><?php echo $footer?></p>
		</footer>

	</div>
<script type="text/javascript">
Reloaded();
</script>
</body>
</html>