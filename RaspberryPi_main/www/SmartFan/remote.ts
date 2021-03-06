//フォーム内の数字が正常か確認
function isNumeralCorrect(formName: string, elementName: string, minValue: number, maxValue: any): boolean {
	var str: string = document.forms[formName].elements[elementName].value;
	if(!(/^-?\d+(\.\d+)?$/.test(str))) {
		alert("数字を入力してください。");
		return false;
	}

	var value: number = Number(str);
	if (minValue > value) {
		alert("値が小さすぎます");
		return false;
	}

	if (maxValue !== "undefined" && maxValue < value) {
		alert("値が大きすぎます。");
		return false;
	}

	return true;
}

//フォーム内でキー入力が発生した場合のイベント
function program_OnKeyDownEvent(event: KeyboardEvent): boolean {
	if (event.keyCode == 13) {
		return false;
	}

	return true;
}

//命令リストの選択項目変更時
function actionList_OnChange(): void {
	var actionList: HTMLSelectElement = document.forms["program"].elements["actionList"];
	if (actionList.selectedIndex < 0) {
		return;
	}
	if (actionList.selectedIndex == 0) {
		ClearDynamicControl();
		return;
	}

	eval((<HTMLOptionElement>actionList[actionList.selectedIndex]).value + "Control()");
}

//起動
function OnProgramControl(): void {
	ClearDynamicControl();
}

//終了
function OffProgramControl(): void {
	ClearDynamicControl();
}

//風量  ラジオボタンx4 弱 中 強 リズム風
function PowerProgramControl(): void {
	ClearDynamicControl();

	var dc: HTMLElement = document.getElementById("dynamicControl");

	var lowRadio: HTMLInputElement = document.createElement("input");
	lowRadio.type = "radio";
	lowRadio.name = "powerProgram";
	lowRadio.value = "Low";
	lowRadio.checked = true;
	dc.appendChild(lowRadio);
	dc.appendChild(document.createTextNode("弱"));

	var middleRadio: HTMLInputElement = document.createElement("input");
	middleRadio.type = "radio";
	middleRadio.name = "powerProgram";
	middleRadio.value = "Middle";
	dc.appendChild(middleRadio);
	dc.appendChild(document.createTextNode("中"));

	var highRadio: HTMLInputElement = document.createElement("input");
	highRadio.type = "radio";
	highRadio.name = "powerProgram";
	highRadio.value = "High";
	dc.appendChild(highRadio);
	dc.appendChild(document.createTextNode("強"));

	var rhythmRadio: HTMLInputElement = document.createElement("input");
	rhythmRadio.type = "radio";
	rhythmRadio.name = "powerProgram";
	rhythmRadio.value = "Rhythm";
	dc.appendChild(rhythmRadio);
	dc.appendChild(document.createTextNode("リズム"));
}

//首振り  ラジオボタンx2 On Off
function SwingProgramControl(): void {
	ClearDynamicControl();

	var dc: HTMLElement = document.getElementById("dynamicControl");

	var onRadio: HTMLInputElement = document.createElement("input");
	onRadio.type = "radio";
	onRadio.name = "swingProgram";
	onRadio.value = "On";
	onRadio.checked = true;
	dc.appendChild(onRadio);
	dc.appendChild(document.createTextNode("On"));

	var offRadio: HTMLInputElement = document.createElement("input");
	offRadio.type = "radio";
	offRadio.name = "swingProgram";
	offRadio.value = "Off";
	dc.appendChild(offRadio);
	dc.appendChild(document.createTextNode("Off"));
}

//命令によって発生するコントロールをすべて削除
function ClearDynamicControl(): void {
	var dc: HTMLElement = document.getElementById("dynamicControl");
	for (var i: number = dc.childNodes.length - 1; i >= 0; i--) {
		dc.removeChild(dc.childNodes[i]);
	}
}

//「セット」ボタン
function AddToDoList(): void {
	if (!isNumeralCorrect("program", "minute", 0, "undefined")) {
		return;
	}

	var actionList: HTMLSelectElement = document.forms["program"].elements["actionList"];

	if (actionList.selectedIndex <= 0) {
		return;
	}

	var selected:HTMLOptionElement = actionList[actionList.selectedIndex];
	var minute: number = document.forms["program"].elements["minute"].value;
	var toDoList: HTMLSelectElement = document.forms["program"].elements["toDoList[]"];

	var text: string = "";
	var keyValue: string = "";

	if (selected.value == "OnProgram") {
		text = selected.text + ":" + minute + "分後";
		keyValue = minute + "_OnProgram";
	} else if (selected.value == "OffProgram") {
		text = selected.text + ":" + minute + "分後";
		keyValue = minute + "_OffProgram";
	} else if (selected.value == "PowerProgram") {
		var radios: NodeList = document.forms["program"].elements["powerProgram"];
		var i: number = 0;
		while (!(<HTMLInputElement>radios[i]).checked) {
			i++;
		}
		text = selected.text + ":" + (<Text>radios[i].nextSibling).data + ":" + minute + "分後";
		keyValue = minute + "_PowerProgram_" + (<HTMLInputElement>radios[i]).value;
	} else if (selected.value == "SwingProgram") {
		var radios: NodeList = <NodeList>document.forms["program"].elements["swingProgram"];
		var i: number = 0;
		while (!(<HTMLInputElement>radios[i]).checked) {
			i++;
		}
		text = selected.text + ":" + (<Text>radios[i].nextSibling).data + ":" + minute + "分後";
		keyValue = minute + "_SwingProgram_" + (<HTMLInputElement>radios[i]).value;
	}
	toDoList.options[toDoList.length] = new Option(text, keyValue);

	SortToDoList();
}

//命令リストを安定ソート
function SortToDoList(): void {
	var toDoList: HTMLSelectElement = document.forms["program"].elements["toDoList[]"];
	var tempArray: Array<string> = new Array<string>();
	var numberArray: Array<number> = new Array<number>();

	for (var i: number = 0; i < toDoList.length; i++) {
		var toDo: HTMLOptionElement = <HTMLOptionElement>toDoList[i];
		var time: string = toDo.value.split("_")[0];
		time = ("0000" + time).slice(-4);
		if (typeof (numberArray[time]) === "undefined") {
			numberArray[time] = 0;
		}
		var num: string = <string>numberArray[time];
		numberArray[time]++;
		num = ("00" + num).slice(-2);
		tempArray[i] = time + "\t" + num + "\t" + toDo.value + "\t" + toDo.text;
	}

	tempArray.sort();

	var childArray: Array<string> = new Array<string>();
	for (var i: number = 0; i < tempArray.length; i++){
		childArray = tempArray[i].split("\t");
		toDoList.options[i] = new Option(childArray[3], childArray[2]);
	}
}

//左「削除」ボタン
function DeleteToDoListItem(): void {
	var toDoList: HTMLSelectElement = document.forms["program"].elements["toDoList[]"];
	if (toDoList.selectedIndex < 0) {
		return;
	}

	for (var i: number = toDoList.length - 1; i >= 0; i--) {
		if ((<HTMLOptionElement>toDoList.options[i]).selected) {
			toDoList.options[i] = null;
		}
	}
}

//保存済みプログラムのリスト選択項目変更時
function savedProgramList_OnChange(): void {
	var spl: HTMLSelectElement = document.forms["program"].elements["savedProgramList"];
	if (spl.selectedIndex < 0) {
		return;
	}
	eval((<HTMLOptionElement>spl[spl.selectedIndex]).value);
}

//保存済みプログラムのリストのダブルクリック時
function savedProgramList_OnDoubleClick(): void {
	(<HTMLSelectElement>document.forms["program"].elements["savedProgramList"]).selectedIndex = -1;
	(<HTMLInputElement>document.forms["program"].elements["saveProgramName"]).value = "";
}

//保存済みプログラムからデータを読み込む
function EditProgram(filename: string, program: string): void {
	ClearToDoListItems();

	(<HTMLInputElement>document.forms["program"].elements["saveProgramName"]).value = filename;
	var actions: Array<string> = program.split("|");
	var toDoList: HTMLSelectElement = document.forms["program"].elements["toDoList[]"];

	var text: string = null;
	var keyValue: string = null;
	var query: Array<string> = null;
	for (var i: number = 0; i < actions.length; i++) {
		text = "";
		keyValue = "";
		query = actions[i].split("_");
		if (query[1] == "OnProgram") {
			text = "起動:" + query[0] + "分後";
		} else if (query[1] == "OffProgram") {
			text = "終了:" + query[0] + "分後";
		} else if (query[1] == "PowerProgram") {
			text = "風量:" + ((query[2] == "Low") ? "弱" : ((query[2] == "Middle") ? "中" : ((query[2] == "High") ? "強" : (query[2] == "Rhythm" ? "リズム" : "Unknown")))) + ":" + query[0] + "分後";
		} else if (query[1] == "SwingProgram") {
			text = "首振り:" + query[2] + ":" + query[0] + "分後";
		}
		keyValue = actions[i];
		toDoList.options[toDoList.length] = new Option(text, keyValue);
	}
}

//命令リストをクリア
function ClearToDoListItems(): void {
	var toDoList: HTMLSelectElement = document.forms["program"].elements["toDoList[]"];

	while (toDoList.length > 0) {
		toDoList.options[toDoList.length - 1] = null;
	}
}

//右「削除」ボタン処理前
function deleteProgramSubmit_OnClickEvent(): boolean {
	if ((<HTMLSelectElement>document.forms["program"].elements["savedProgramList"]).selectedIndex < 0) {
		alert("削除するプログラムを選択してください。");
		return false;
	}
	return true;
}

//「保存」ボタンイベント
function saveProgramSubmit_ClickeEvent(): boolean {
	if ((<HTMLInputElement>document.forms["program"].elements["saveProgramName"]).value == "") {
		alert("プログラム名を入力してください。");
		return false;
	}

	var toDoList: HTMLSelectElement = document.forms["program"].elements["toDoList[]"];

	if (toDoList.childElementCount <= 0) {
		alert('命令が空です。');
		return false;
	}

	for (var i: number = toDoList.length - 1; i >= 0; i--) {
		(<HTMLOptionElement>toDoList.options[i]).selected = true;
	}

	return true;
}

//「送信」ボタンイベント
function sendProgramSubmit_ClickeEvent() {
	if ((<HTMLInputElement>document.forms["program"].elements["saveProgramName"]).value == "") {
		alert("プログラム名を入力してください。");
		return false;
	}

	var toDoList: HTMLSelectElement = document.forms["program"].elements["toDoList[]"];

	if (toDoList.childElementCount <= 0) {
		alert('命令が空です。');
		return false;
	}

	for (var i: number = toDoList.length - 1; i >= 0; i--) {
		(<HTMLOptionElement>toDoList.options[i]).selected = true;
	}

	return true;
}

//ページ読み込み時に選択をリセット
function Reloaded() {
	ClearDynamicControl();

	(<HTMLOptionElement>document.getElementById("actionListDefault")).selected = true;
	(<HTMLInputElement>document.forms["program"].elements["minute"]).value = "0";
	(<HTMLSelectElement>document.forms["program"].elements["savedProgramList"]).selectedIndex = -1;
	(<HTMLInputElement>document.forms["program"].elements["saveProgramName"]).value = "";
}

class ValueGetter{
	private dataURL: string;
	private timerToken: number;

	constructor(dataURL: string) {
		this.dataURL = dataURL;
	}

	public Update(): void {
		var req = new XMLHttpRequest();
		req.open('GET', this.dataURL, false);
		req.setRequestHeader('Pragma', 'no-cache');
		req.setRequestHeader('Cache-Control', 'no-cache');
		req.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
		req.send();
		var lines = req.responseText.split('\n');
		delete req;

		//最新のデータを取得
		var lastLine = lines[lines.length - 1];
		if (lastLine === "" && lines.length >= 2) {
			lastLine = lines[lines.length - 2];
		}
		var data = lastLine.split(",");

		if (data.length < 6) {
			console.error("送られてくるデータが少なすぎます。");
			console.error(lastLine);
			console.error(data);
			return;
		}

		this.RewriteElements("switchInsert", data[2]);
		if (data[3] === "-1.0") {
			this.RewriteElements("powerInsert", "リズム");
		} else {
			this.RewriteElements("powerInsert", data[3] + "％");
		}
		this.RewriteElements("swingInsert", data[4]);
		this.RewriteElements("temperatureSettingInsert", data[5] + "℃");
	}

	private RewriteElements(id: string, str: string): void {
		var elem = document.getElementById(id);
		elem.textContent = str;
	}
	
	public Start(): void {
		this.Update();
		this.timerToken = setInterval(() => { this.Update(); }, 10000);//10seconds
	}
}