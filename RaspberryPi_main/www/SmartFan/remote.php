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
<script type="text/javascript" src="remote.js"></script>
<script type="text/javascript">
	window.onload = function(){
		Reloaded();
		var v = new ValueGetter("data.csv");
		v.Start();
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
			<p>Smartfanを外部から制御することができます。</p>
			<p>Smartfanを経由して、エアコンの設定をすることもできます。</p>
			<p>Javascriptを使用していますので、Javascriptを有効にしてください。 </p>
		</div>

		<div id="main">
		<h2>Remote</h2>
			<?php
				if(isset($_POST['switchSubmit'])){
					if(makeTask("Switch " . $_POST['switch'])){
						echo "<p class=\"result\">Smartfanの電源を" . ($_POST['switch']==1?"On":"Off") ."に設定しました</p>";
					}else{
						echo "<p class=\"result\">Smartfanの電源の指定に失敗しました。</p>";
					}
				
				}else if(isset($_POST['powerSubmit'])){
					if(preg_match("/^-?\d+(\.\d+)?$/", $_POST['power'])){
						$power = (float)$_POST['power'];
						if (0 <= $power && $power <= 100) {
							if(makeTask("Power " . $power)){
								echo "<p class=\"result\">風量を" . $power . "％に設定しました。</p>";
							}else{
								echo "<p class=\"result\">風量の指定に失敗しました。</p>";
							}
						}else {
							echo "<p class=\"result\">風量の値が範囲外です。</p>";
						}
					}else {
						echo "<p class=\"result\">風量の値が数字ではありません。</p>";
					}
					
				}elseif(isset($_POST['swingSubmit'])){
					if(makeTask("Swing " . $_POST['swing'])){
						echo "<p class=\"result\">Smartfanの首振りを" . ($_POST['swing']==1?"On":"Off") ."に設定しました</p>";
					}else{
						echo "<p class=\"result\">Smartfanの首振りの指定に失敗しました。</p>";
					}
					
				}elseif(isset($_POST['temperatureSubmit'])) {
					if(preg_match("/^-?\d+(\.\d+)?$/", $_POST['temperature'])){
						$temperature = (float)$_POST['temperature'];
						if (15 <= $temperature && $temperature <= 30) {
							if(makeTask("Temperature " . $temperature)){
								echo "<p class=\"result\">エアコンの温度を" . $temperature . "度に設定しました。</p>";
							}else{
								echo "<p class=\"result\">エアコンの温度の指定に失敗しました。</p>";
							}
						}else {
							echo "<p class=\"result\">エアコンの温度の値が範囲外です。</p>";
						}
					}else {
						echo "<p class=\"result\">エアコンの温度の値が数字ではありません。</p>";
					}
					
				}elseif(isset($_POST['deleteProgramSubmit'])){
					$toDeleteProgram = preg_replace("/EditProgram\('(.*)'.'.*'\)/", "$1", $_POST['savedProgramList']);
					unlink("SmartfanProgram/" . $toDeleteProgram . ".sp");
					echo "<p class=\"result\">プログラム \"" . $toDeleteProgram . "\" を削除しました。</p>\n";
					
				}elseif(isset($_POST['saveProgramSubmit'])){
					$isOverwrite = file_exists("SmartfanProgram/" . $_POST['saveProgramName'] . ".sp");
					$fp = fopen("SmartfanProgram/" . $_POST['saveProgramName'] . ".sp", "w+");
					fwrite($fp, join("\n", $_POST['toDoList']));
					fclose($fp);
					echo "<p class=\"result\">プログラム \"" . $_POST['saveProgramName'] . "\" を" . ($isOverwrite?"上書き":"") ."保存しました。</p>\n";
					
				}elseif(isset($_POST['sendProgramSubmit'])){
					if(makeTimerTask($_POST['saveProgramName'] ,$_POST['toDoList'])){
						echo "<p class=\"result\">プログラム \"" . $_POST['saveProgramName'] . "\" を送信しました。</p>\n";
					}else{
						echo "<p>既に他のプログラムが実行されています。</p>\n";
					}
					
				}elseif(isset($_POST['cancelProgramSubmit'])){
					if(file_exists("timerTask")){
						$fp = @opendir("timerTask");
						while(($item = readdir($fp)) !== false){
							if($item !== "." && $item !== ".."){
								unlink("timerTask/" . $item);
							}
						}
						rmdir("timerTask");
						echo "<p class=\"result\">プログラムを中断しました。</p>";
					}else{
						echo "<p class=\"result\">実行中のプログラムがありません。</p>";
					}
					
				}else {
					//nothing
				}
			?>
			<form name="switch" method="post" action="remote.php">
				<h3>Smartfanの電源</h3>
				<p>現在の状況:<span id="switchInsert">Off</span></p>
				<input type="radio" name="switch" value="1" checked/>On
				<input type="radio" name="switch" value="0" />Off
				<input type="submit" name="switchSubmit" value="送信" />
			</form>
			<form name="power" method="post" action="remote.php">
				<h3>風量(0.0 -- 100.0)％</h3>
				<p>現在の状況:<span id="powerInsert">0％</span></p>
				<input type="number" name="power" min="0" max="100" />
				<input type="submit" name="powerSubmit" onclick="return isNumeralCorrect('power','power',0,100)" value="送信" />
			</form>
			<form name="swing" method="post" action="remote.php">
				<h3>Smartfanの首振り</h3>
				<p>現在の状況:<span id="swingInsert">Off</span></p>
				<input type="radio" name="swing" value="1" checked/>On
				<input type="radio" name="swing" value="0" />Off
				<input type="submit" name="swingSubmit" value="送信" />
			</form>
			<form name="temperature" method="post" action="remote.php">
				<h3>エアコン連動(15.0 -- 30.0)℃</h3>
				<p>現在の設定状況:<span id="temperatureSettingInsert">28.0℃</span></p>
				<input type="number" name="temperature" min="15" max="30" />
				<input type="submit" name="temperatureSubmit" onclick="return isNumeralCorrect('temperature','temperature',15,30)" value="送信" />
			</form>
			<form name="program" method="post" action="remote.php" onkeydown="return program_OnKeyDownEvent(event)">
				<h3>Smartfan プログラム</h3>
				<select name="actionList" style="width:200px" onchange="actionList_OnChange()">
					<option value="" id="actionListDefault" selected>---- 命令を選んでください ----</option>
					<?php
						foreach($actionList as $child){
							echo '<option value="' . $child['value'] . '">' . $child['description'] . '</option>' . "\n";
						}
					?>
				</select>
				<span id="dynamicControl"></span>
				<input type="number" name="minute" min="0" value="0" style="width:40px;"/>分後
				<input type="button" value="セット" onclick="AddToDoList()" style="width:45px;" /><br />
				<select name="toDoList[]" size="5" style="width:200px" multiple>
				</select>
				<input type="button" value="削除" onclick="DeleteToDoListItem()" />
				<select name="savedProgramList" size="5" style="width:180px" onchange="savedProgramList_OnChange()" ondblclick="savedProgramList_OnDoubleClick()">
					<?php
						foreach(glob('SmartfanProgram/*.sp') as $p){
							$name = preg_replace("/SmartfanProgram\/(.*)\.sp/","\\1", $p);
							$line = preg_replace("/(\r\n|\n\r|\r|\n)/","|", file_get_contents($p));
							printf("<option value=\"EditProgram('%s','%s')\">%s</option>\n", $name, $line, $name);
						}
					?>
				</select>
				<input type="submit" name="deleteProgramSubmit" value="削除" onclick="return deleteProgramSubmit_OnClickEvent()"/><br />
				プログラム名:<input id="saveProgramName" name="saveProgramName" type="text" style="width:180px;"/>
				<input type="submit" name="saveProgramSubmit" value="保存" onclick="return saveProgramSubmit_ClickeEvent()" />
				<input type="submit" name="sendProgramSubmit" value="送信" onclick="return sendProgramSubmit_ClickeEvent()" />
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
</body>
</html>