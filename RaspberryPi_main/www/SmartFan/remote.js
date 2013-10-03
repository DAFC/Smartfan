//フォーム内の数字が正常か確認
function isNumeralCorrect(formName, elementName, minValue, maxValue) {
    var str = document.forms[formName].elements[elementName].value;
    if (!(/^-?\d+(\.\d+)?$/.test(str))) {
        alert("数字を入力してください。");
        return false;
    }

    var value = Number(str);
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
function program_OnKeyDownEvent(event) {
    if (event.keyCode == 13) {
        return false;
    }

    return true;
}

//命令リストの選択項目変更時
function actionList_OnChange() {
    var actionList = document.forms["program"].elements["actionList"];
    if (actionList.selectedIndex < 0) {
        return;
    }
    if (actionList.selectedIndex == 0) {
        ClearDynamicControl();
        return;
    }

    eval((actionList[actionList.selectedIndex]).value + "Control()");
}

//起動
function OnProgramControl() {
    ClearDynamicControl();
}

//終了
function OffProgramControl() {
    ClearDynamicControl();
}

//風量  ラジオボタンx4 弱 中 強 リズム風
function PowerProgramControl() {
    ClearDynamicControl();

    var dc = document.getElementById("dynamicControl");

    var lowRadio = document.createElement("input");
    lowRadio.type = "radio";
    lowRadio.name = "powerProgram";
    lowRadio.value = "Low";
    lowRadio.checked = true;
    dc.appendChild(lowRadio);
    dc.appendChild(document.createTextNode("弱"));

    var middleRadio = document.createElement("input");
    middleRadio.type = "radio";
    middleRadio.name = "powerProgram";
    middleRadio.value = "Middle";
    dc.appendChild(middleRadio);
    dc.appendChild(document.createTextNode("中"));

    var highRadio = document.createElement("input");
    highRadio.type = "radio";
    highRadio.name = "powerProgram";
    highRadio.value = "High";
    dc.appendChild(highRadio);
    dc.appendChild(document.createTextNode("強"));

    var rhythmRadio = document.createElement("input");
    rhythmRadio.type = "radio";
    rhythmRadio.name = "powerProgram";
    rhythmRadio.value = "Rhythm";
    dc.appendChild(rhythmRadio);
    dc.appendChild(document.createTextNode("リズム"));
}

//首振り  ラジオボタンx2 On Off
function SwingProgramControl() {
    ClearDynamicControl();

    var dc = document.getElementById("dynamicControl");

    var onRadio = document.createElement("input");
    onRadio.type = "radio";
    onRadio.name = "swingProgram";
    onRadio.value = "On";
    onRadio.checked = true;
    dc.appendChild(onRadio);
    dc.appendChild(document.createTextNode("On"));

    var offRadio = document.createElement("input");
    offRadio.type = "radio";
    offRadio.name = "swingProgram";
    offRadio.value = "Off";
    dc.appendChild(offRadio);
    dc.appendChild(document.createTextNode("Off"));
}

//命令によって発生するコントロールをすべて削除
function ClearDynamicControl() {
    var dc = document.getElementById("dynamicControl");
    for (var i = dc.childNodes.length - 1; i >= 0; i--) {
        dc.removeChild(dc.childNodes[i]);
    }
}

//「セット」ボタン
function AddToDoList() {
    if (!isNumeralCorrect("program", "minute", 0, "undefined")) {
        return;
    }

    var actionList = document.forms["program"].elements["actionList"];

    if (actionList.selectedIndex <= 0) {
        return;
    }

    var selected = actionList[actionList.selectedIndex];
    var minute = document.forms["program"].elements["minute"].value;
    var toDoList = document.forms["program"].elements["toDoList[]"];

    var text = "";
    var keyValue = "";

    if (selected.value == "OnProgram") {
        text = selected.text + ":" + minute + "分後";
        keyValue = minute + "_OnProgram";
    } else if (selected.value == "OffProgram") {
        text = selected.text + ":" + minute + "分後";
        keyValue = minute + "_OffProgram";
    } else if (selected.value == "PowerProgram") {
        var radios = document.forms["program"].elements["powerProgram"];
        var i = 0;
        while (!(radios[i]).checked) {
            i++;
        }
        text = selected.text + ":" + (radios[i].nextSibling).data + ":" + minute + "分後";
        keyValue = minute + "_PowerProgram_" + (radios[i]).value;
    } else if (selected.value == "SwingProgram") {
        var radios = document.forms["program"].elements["swingProgram"];
        var i = 0;
        while (!(radios[i]).checked) {
            i++;
        }
        text = selected.text + ":" + (radios[i].nextSibling).data + ":" + minute + "分後";
        keyValue = minute + "_SwingProgram_" + (radios[i]).value;
    }
    toDoList.options[toDoList.length] = new Option(text, keyValue);

    SortToDoList();
}

//命令リストを安定ソート
function SortToDoList() {
    var toDoList = document.forms["program"].elements["toDoList[]"];
    var tempArray = new Array();
    var numberArray = new Array();

    for (var i = 0; i < toDoList.length; i++) {
        var toDo = toDoList[i];
        var time = toDo.value.split("_")[0];
        time = ("0000" + time).slice(-4);
        if (typeof (numberArray[time]) === "undefined") {
            numberArray[time] = 0;
        }
        var num = numberArray[time];
        numberArray[time]++;
        num = ("00" + num).slice(-2);
        tempArray[i] = time + "\t" + num + "\t" + toDo.value + "\t" + toDo.text;
    }

    tempArray.sort();

    var childArray = new Array();
    for (var i = 0; i < tempArray.length; i++) {
        childArray = tempArray[i].split("\t");
        toDoList.options[i] = new Option(childArray[3], childArray[2]);
    }
}

//左「削除」ボタン
function DeleteToDoListItem() {
    var toDoList = document.forms["program"].elements["toDoList[]"];
    if (toDoList.selectedIndex < 0) {
        return;
    }

    for (var i = toDoList.length - 1; i >= 0; i--) {
        if ((toDoList.options[i]).selected) {
            toDoList.options[i] = null;
        }
    }
}

//保存済みプログラムのリスト選択項目変更時
function savedProgramList_OnChange() {
    var spl = document.forms["program"].elements["savedProgramList"];
    if (spl.selectedIndex < 0) {
        return;
    }
    eval((spl[spl.selectedIndex]).value);
}

//保存済みプログラムのリストのダブルクリック時
function savedProgramList_OnDoubleClick() {
    (document.forms["program"].elements["savedProgramList"]).selectedIndex = -1;
    (document.forms["program"].elements["saveProgramName"]).value = "";
}

//保存済みプログラムからデータを読み込む
function EditProgram(filename, program) {
    ClearToDoListItems();

    (document.forms["program"].elements["saveProgramName"]).value = filename;
    var actions = program.split("|");
    var toDoList = document.forms["program"].elements["toDoList[]"];

    var text = null;
    var keyValue = null;
    var query = null;
    for (var i = 0; i < actions.length; i++) {
        text = "";
        keyValue = "";
        query = actions[i].split("_");
        if (query[1] == "OnProgram") {
            text = "起動:" + query[0] + "分後";
        } else if (query[1] == "OffProgram") {
            text = "終了:" + query[0] + "分後";
        } else if (query[1] == "PowerProgram") {
            text = "風量:" + ((query[2] == "low") ? "弱" : ((query[2] == "middle") ? "中" : ((query[2] == "high") ? "強" : (query[2] == "rhythm" ? "リズム" : "Unknown")))) + ":" + query[0] + "分後";
        } else if (query[1] == "SwingProgram") {
            text = "首振り:" + query[2] + ":" + query[0] + "分後";
        }
        keyValue = actions[i];
        toDoList.options[toDoList.length] = new Option(text, keyValue);
    }
}

//命令リストをクリア
function ClearToDoListItems() {
    var toDoList = document.forms["program"].elements["toDoList[]"];

    while (toDoList.length > 0) {
        toDoList.options[toDoList.length - 1] = null;
    }
}

//右「削除」ボタン処理前
function deleteProgramSubmit_OnClickEvent() {
    if ((document.forms["program"].elements["savedProgramList"]).selectedIndex < 0) {
        alert("削除するプログラムを選択してください。");
        return false;
    }
    return true;
}

//「保存」ボタンイベント
function saveProgramSubmit_ClickeEvent() {
    if ((document.forms["program"].elements["saveProgramName"]).value == "") {
        alert("プログラム名を入力してください。");
        return false;
    }

    var toDoList = document.forms["program"].elements["toDoList[]"];

    if (toDoList.childElementCount <= 0) {
        alert('命令が空です。');
        return false;
    }

    for (var i = toDoList.length - 1; i >= 0; i--) {
        (toDoList.options[i]).selected = true;
    }

    return true;
}

//「送信」ボタンイベント
function sendProgramSubmit_ClickeEvent() {
    if ((document.forms["program"].elements["saveProgramName"]).value == "") {
        alert("プログラム名を入力してください。");
        return false;
    }

    var toDoList = document.forms["program"].elements["toDoList[]"];

    if (toDoList.childElementCount <= 0) {
        alert('命令が空です。');
        return false;
    }

    for (var i = toDoList.length - 1; i >= 0; i--) {
        (toDoList.options[i]).selected = true;
    }

    return true;
}

//ページ読み込み時に選択をリセット
function Reloaded() {
    ClearDynamicControl();

    (document.getElementById("actionListDefault")).selected = true;
    (document.forms["program"].elements["minute"]).value = "0";
    (document.forms["program"].elements["savedProgramList"]).selectedIndex = -1;
    (document.forms["program"].elements["saveProgramName"]).value = "";
}

var ValueGetter = (function () {
    function ValueGetter(dataURL) {
        this.dataURL = dataURL;
    }
    ValueGetter.prototype.Update = function () {
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
        var data = lastLine.split(",");

        if (data.length < 7) {
            console.error("送られてくるデータが少なすぎます。");
            return;
        }

        this.RewriteElements("switchInsert", (data[2] != "0") ? "On" : "Off");
        this.RewriteElements("powerInsert", data[3] + "％");
        this.RewriteElements("swingInsert", (data[4] != "0") ? "On" : "Off");
        this.RewriteElements("temperatureSettingInsert", data[5] + "℃");
    };

    ValueGetter.prototype.RewriteElements = function (id, str) {
        var elem = document.getElementById(id);
        elem.textContent = str;
    };

    ValueGetter.prototype.Start = function () {
        var _this = this;
        this.Update();
        this.timerToken = setInterval(function () {
            _this.Update();
        }, 20000);
    };
    return ValueGetter;
})();
//@ sourceMappingURL=remote.js.map
