var State;
(function (State) {
    State[State["None"] = 0] = "None";
    State[State["REM"] = 1] = "REM";
    State[State["NonREM"] = 2] = "NonREM";
})(State || (State = {}));
;

var mX = 0;
var mY = 0;
var mn = 0;
var data = new Array();
var state = State.None;

var Maneger = (function () {
    function Maneger(makedTaskId, resultId) {
        this.makedTask = document.getElementById(makedTaskId);
        this.result = document.getElementById(resultId);
        for (var i = 0; i < 100; i++) {
            data.push(false);
        }
    }
    Maneger.prototype.Start = function () {
        var _this = this;
        this.result.innerHTML = "お使いの端末は、この機能を使用できません。";
        window.addEventListener("devicemotion", this.EventFunction, true);
        this.timerToken = setInterval(function () {
            _this.Check();
        }, 10000);
    };

    //センサーから傾きを読み取る関数
    Maneger.prototype.EventFunction = function (event0) {
        this.result.innerHTML = "";
        if (!(document.getElementById('isSleep')).checked) {
            mX = 0;
            mY = 0;
            mn = 0;
            this.makedTask.innerHTML = "";
            return;
        }
        var x = event0.accelerationIncludingGravity.x;
        var y = event0.accelerationIncludingGravity.y;
        var z = event0.accelerationIncludingGravity.z;

        //this.mX += <number>x;
        //this.mY += <number>y;
        mX = (mX * mn + x) / (mn + 1);
        mY = (mY * mn + y) / (mn + 1);
        mn++;

        var d = (mX - x) * (mX - x) + (mY - y) * (mY - y);

        this.result.innerHTML = "X：" + Math.round(x * 10000) / 10000 + "<br />" + "Y：" + Math.round(y * 10000) / 10000 + "<br />" + "Z：" + Math.round(z * 10000) / 10000 + "<br />" + "(mX, mY) = (" + mX.toString() + ", " + mY.toString() + ")" + "<br />" + "差:" + (Math.round(d * 10000) / 10000).toString();

        if (d > 0.025) {
            mX = x;
            mY = y;
            mn = 0;
            data.push(true);
            data.shift();
        } else {
            data.push(false);
            data.shift();
        }

        var count = 0;
        data.forEach(function (value) {
            if (value == true) {
                count++;
            }
        });
        this.result.innerHTML += "<br />" + "count:" + count.toString();
        if (count > 20) {
            this.makedTask.innerHTML = "寝返り!";
            state = State.REM;
        } else {
            this.makedTask.innerHTML = "正常";
            state = State.NonREM;
        }
        this.result.innerHTML += "<br />" + "Mode:" + state;
    };

    Maneger.prototype.Submit = function (c, v) {
        /*
        var form: HTMLFormElement = <HTMLFormElement>document.createElement('__form__');
        document.body.appendChild(form);
        var input: HTMLInputElement = <HTMLInputElement>document.createElement('__input__');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', '');
        input.setAttribute('value', '');
        form.appendChild(input);
        form.submit();
        */
        var req = new XMLHttpRequest();
        req.open('POST', 'sleepInner.php', false);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.send(EncodeHTMLForm({ command: 'Power', value: '1' }));
        if (req.status == 200) {
            this.makedTask.innerHTML = req.responseText;
        } else {
            this.makedTask.innerHTML = "失敗";
        }
    };

    Maneger.prototype.Check = function () {
        switch (state) {
            case State.REM:
                this.Submit("Power", 100);
                break;
            case State.NonREM:
                this.Submit("Power", 60);
                break;
        }
    };
    return Maneger;
})();

//Switch 1; On
//Switch 0; Off
//Power 0.0-100.0;
// HTMLフォームの形式にデータを変換する
function EncodeHTMLForm(data) {
    var params = [];

    for (var name in data) {
        var value = data[name];
        var param = encodeURIComponent(name).replace(/%20/g, '+') + '=' + encodeURIComponent(value).replace(/%20/g, '+');

        params.push(param);
    }

    return params.join('&');
}
//@ sourceMappingURL=sleep.js.map
