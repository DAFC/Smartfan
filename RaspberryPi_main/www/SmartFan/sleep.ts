enum State { None, REM, NonREM };

var mX = 0;//x方向の重力平均値
var mY = 0;//y方向の重力平均値
var mn = 0;//平均の母数
var data: boolean[] = new Array<boolean>();
var state: State = State.None;

class Maneger {
	private makedTask: HTMLElement;
	private result: HTMLElement;
	//private mX: number;//x方向の重力平均値
	//private mY: number;//y方向の重力平均値

	private timerToken: number;
	
	constructor(makedTaskId: string, resultId: string) {
		this.makedTask = document.getElementById(makedTaskId);
		this.result = document.getElementById(resultId);
		for (var i = 0; i < 100; i++) {
			data.push(false);
		}
		//this.mX = 0;
		//this.mY = 0;
	}

	Start() {
		this.result.innerHTML = "お使いの端末は、この機能を使用できません。";
		window.addEventListener("devicemotion", this.EventFunction, true);
		this.timerToken = setInterval(() => { this.Check(); }, 10000);//10seconds
	}

	//センサーから傾きを読み取る関数
	EventFunction(event0): void {
		this.result.innerHTML = "";
		if (!(<HTMLInputElement>document.getElementById('isSleep')).checked) {
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

		this.result.innerHTML =
		"X：" + Math.round(x * 10000) / 10000 + "<br />" +
		"Y：" + Math.round(y * 10000) / 10000 + "<br />" +
		"Z：" + Math.round(z * 10000) / 10000 + "<br />" +
		//"(mX, mY) = (" + this.mX.toString() + ", " + this.mY.toString() + ")" ;
		"(mX, mY) = (" + mX.toString() + ", " + mY.toString() + ")" + "<br />" +
		"差:" + (Math.round(d * 10000) / 10000).toString();

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

		var count: number = 0;
		data.forEach((value) => { if (value == true) { count++; } });
		this.result.innerHTML += "<br />" + "count:" + count.toString();
		if (count > 20) {
			this.makedTask.innerHTML = "寝返り!";
			state = State.REM;
		} else {
			this.makedTask.innerHTML = "正常";
			state = State.NonREM;
		}
		this.result.innerHTML += "<br />" + "Mode:" + state;
	}

	Submit(c: string, v: number): void {
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
		if (req.status == 200) {//成功
			this.makedTask.innerHTML = req.responseText;
		} else {
			this.makedTask.innerHTML = "失敗";
		}
	}

	Check(): void {
		switch (state) {
			case State.REM:
				this.Submit("Power", 100);
				break;
			case State.NonREM:
				this.Submit("Power", 60);
				break;
		}
	}
}
//Switch 1; On
//Switch 0; Off
//Power 0.0-100.0;

// HTMLフォームの形式にデータを変換する
function EncodeHTMLForm(data) {
	var params = [];

	for (var name in data)
	{
		var value = data[name];
		var param = encodeURIComponent(name).replace(/%20/g, '+')
			+ '=' + encodeURIComponent(value).replace(/%20/g, '+');

		params.push(param);
	}

	return params.join('&');
}