//「セット」ボタン
function AddToDoList(){
	var actionList = document.forms["program"].elements["actionList"];
	if(actionList.selectedIndex <= 0){
		return;
	}
	
	var selected = actionList[actionList.selectedIndex];
	var minute = document.forms["program"].elements["minute"].value;
	var toDoList = document.forms["program"].elements["toDoList"];
	
	var text = "";
	var keyValue = "";
	if(selected.value == "OnProgram"){
		text = selected.text + ":" + minute + "分後";
		keyValue = minute + "_OnProgram";
	}else if(selected.value == "OffProgram"){
		text = selected.text + ":" + minute + "分後";
		keyValue = minute + "_OffProgram";
	}else if(selected.value == "PowerProgram"){
		var radios = document.getElementsByName("powerProgram");
		var i = 0;
		while(!radios[i].checked) i++;
		text = selected.text + ":" + radios[i].nextSibling.data + ":" + minute + "分後";
		keyValue = minute + "_PowerProgram_" + radios[i].value;
	}else if(selected.value == "SwingProgram"){
		var radios = document.getElementsByName("swingProgram");
		var i = 0;
		while(!radios[i].checked) i++;
		text = selected.text + ":" + radios[i].nextSibling.data + ":" + minute + "分後";
		keyValue = minute + "_SwingProgram_" + radios[i].value;
	}
	toDoList.options[toDoList.length]=new Option(text, keyValue);
	
	SortToDoList();
}

//左「削除」ボタン
function DeleteToDoListItem(){
	var toDoList = document.forms["program"].elements["toDoList"];
	if(toDoList.selectedIndex < 0){
		return;
	}
	
	for(var i = toDoList.length - 1; i>=0; i--){
		if(toDoList.options[i].selected)
			toDoList.options[i] = null;
	}
}

//命令リストの選択項目変更時
function actionListChanged(){
	var actionList = document.forms["program"].elements["actionList"];
	if(actionList.selectedIndex < 0){
		return;
	}
	if(actionList.selectedIndex == 0){
		ClearDynamicControl();
		return;
	}
	
	eval(actionList[actionList.selectedIndex].value + "Control()");
}

//起動
function OnProgramControl(){
	ClearDynamicControl();
}

//終了
function OffProgramControl(){
	ClearDynamicControl();
}

//風量  ラジオボタンx4 弱 中 強 リズム風
function PowerProgramControl(){
	ClearDynamicControl();
	var dc = document.getElementById("dynamicControl");
	
	var low = document.createElement("input");
	low.type = "radio";
	low.name = "powerProgram";
	low.value = "low";
	low.checked = true;
	dc.appendChild(low);
	dc.appendChild(document.createTextNode("弱"));
	
	var middle = document.createElement("input");
	middle.type = "radio";
	middle.name = "powerProgram";
	middle.value = "middle";
	dc.appendChild(middle);
	dc.appendChild(document.createTextNode("中"));
	
	var high = document.createElement("input");
	high.type = "radio";
	high.name = "powerProgram";
	high.value = "high";
	dc.appendChild(high);
	dc.appendChild(document.createTextNode("強"));
	
	var rhythm = document.createElement("input");
	rhythm.type = "radio";
	rhythm.name = "powerProgram";
	rhythm.value = "rhythm";
	dc.appendChild(rhythm);
	dc.appendChild(document.createTextNode("リズム"));
}

//首振り  ラジオボタンx2 On Off
function SwingProgramControl(){
	ClearDynamicControl();
	var dc = document.getElementById("dynamicControl");
	
	var on = document.createElement("input");
	on.type = "radio";
	on.name = "swingProgram";
	on.value = "on";
	on.checked = true;
	dc.appendChild(on);
	dc.appendChild(document.createTextNode("On"));
	
	var off = document.createElement("input");
	off.type = "radio";
	off.name = "swingProgram";
	off.value = "off";
	dc.appendChild(off);
	dc.appendChild(document.createTextNode("Off"));
}

//命令によって発生するコントロールをすべて削除
function ClearDynamicControl(){
	var dc = document.getElementById("dynamicControl");
	for(var i = dc.childNodes.length - 1; i>=0; i--){
		dc.removeChild(dc.childNodes[i]);
	}
}

//ページ読み込み時に選択をリセット
function Reloaded(){
	ClearDynamicControl();
	document.getElementById("actionListDefault").selected = true;
	document.getElementById("minute").value = 0;
	document.getElementById("savedProgramList").selectedIndex = -1;
	document.getElementById("saveProgramName").value = "";
}

//保存済みプログラムのリスト選択項目変更時
function savedProgramListChanged(){
	var spl = document.forms["program"].elements["savedProgramList"];
	if(spl.selectedIndex < 0){
		return;
	}
	eval(spl[spl.selectedIndex].value);
}

//保存済みプログラムからデータを読み込む
function EditProgram(filename, programString){
	ClearToDoListItems();
	document.getElementById("saveProgramName").value = filename;
	var actions = programString.split("|");
	var toDoList = document.forms["program"].elements["toDoList"];
		
	for(var i = 0; i < actions.length; i++){
		var text = "";
		var keyValue = "";
		var query = actions[i].split("_");
		if(query[1] == "OnProgram"){
			text = "起動:" + query[0] + "分後";
		}else if(query[1] == "OffProgram"){
			text = "終了:" + query[0] + "分後";
		}else if(query[1] == "PowerProgram"){
			text = "風量:" + ((query[2]=="low")?"弱":((query[2]=="middle")?"中":((query[2]=="high")?"強":(query[2]=="rhythm"?"リズム":"Unknown")))) + ":" + query[0] + "分後";
		}else if(query[1] == "SwingProgram"){
			text = "首振り:" + query[2] + ":" + query[0] + "分後";
		}
		keyValue = actions[i];
		toDoList.options[toDoList.length]=new Option(text, keyValue);
	}
}

//命令リストをクリア
function ClearToDoListItems(){
	var toDoList = document.forms["program"].elements["toDoList"];
	
	toDoList.options[toDoList.selectedIndex] = null;
	
	while(toDoList.length > 0){
		toDoList.options[toDoList.length - 1] = null;
	}
}

//命令リストを安定ソート
function SortToDoList(){
	var toDoList = document.getElementById("toDoList");
	var tempArray = new Array();
	var numberArray = new Array();
	var childArray = new Array();
	
	for(var i = 0; i<toDoList.length; i++){
		var time = toDoList[i].value.split("_")[0];
		time = ("0000" + time).slice(-4);
		if(typeof numberArray[time] === "undefined"){
			numberArray[time] = 0;
		}
		var number = numberArray[time]++;
		number = ("00" + number).slice(-2);
		tempArray[i] = time + "\t" + number + "\t" + toDoList[i].value　+ "\t" + toDoList[i].text;
	}
	
	tempArray.sort();
	
	for(var i = 0; i<tempArray.length; i++){
		childArray = tempArray[i].split("\t");
		toDoList.options[i].value = childArray[2];
		toDoList.options[i].text = childArray[3];
	}
}

//「保存」ボタン
function saveProgramSubmitClicked(){
	if(document.getElementById('saveProgramName').value==''){
		alert('プログラム名を入力してください。');
		return false;
	}
	
	var toDoList = document.forms["program"].elements["toDoList"];
	
	if(toDoList.childElementCount <= 0){
		alert('命令が空です。');
		return false;
	}
	
	for(var i = toDoList.length - 1; i>=0; i--){
		toDoList.options[i].selected = true;
	}
	return true;
}

//「送信」ボタン
function sendProgramSubmitClicked(){
	if(document.getElementById('saveProgramName').value==''){
		alert('プログラム名を入力してください。');
		return false;
	}
	
	var toDoList = document.forms["program"].elements["toDoList"];
	
	if(toDoList.childElementCount <= 0){
		alert('命令が空です。');
		return false;
	}
	
	for(var i = toDoList.length - 1; i>=0; i--){
		toDoList.options[i].selected = true;
	}
	return true;
}