var DataName;
(function (DataName) {
    DataName[DataName["Temperature"] = 0] = "Temperature";
    DataName[DataName["Humidity"] = 1] = "Humidity";
})(DataName || (DataName = {}));

var Graph = (function () {
    function Graph(canvasId, dataName, dataURL) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.dataName = dataName;
        this.dataURL = dataURL;

        this.context.fillStyle = "rgb(0,0,0)";
        this.context.strokeStyle = "rgb(32,32,32)";
    }
    Graph.prototype.position = function (value, median, absmax) {
        var v = (value - median) / absmax;
        v *= (this.canvas.height - 20) / 2;
        v += this.canvas.height / 2;
        return (this.canvas.height - v);
    };

    Graph.prototype.Draw = function () {
        var _this = this;
        var req = new XMLHttpRequest();
        req.open('GET', this.dataURL, false);
        req.setRequestHeader('Pragma', 'no-cache');
        req.setRequestHeader('Cache-Control', 'no-cache');
        req.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
        req.send();
        var data = req.responseText.split('\n');
        delete req;
        var array = Array();
        data.forEach(function (line) {
            var str = line.split(',')[_this.dataName];
            if ((str != null) && (str != "") && (str != undefined)) {
                array.push(+str);
            }
        });

        var median = 0;
        array.forEach(function (value) {
            median += value;
        });
        median /= array.length;

        var absmax = 0;
        array.forEach(function (value) {
            if (absmax < Math.abs(median - value)) {
                absmax = Math.abs(median - value);
            }
        });

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var near = Math.round(median / 10) * 10;

        this.context.font = "12px 'sans-serif'";
        this.context.strokeStyle = "rgb(128,128,128)";
        for (var i = near - 50; i <= near + 50; i += 10) {
            if (i != near) {
                this.context.fillText(i.toString(), 0, this.position(i, median, absmax) - 5);
                this.context.moveTo(0, this.position(i, median, absmax));
                this.context.lineTo(this.canvas.width, this.position(i, median, absmax));
            }
        }
        this.context.stroke();

        this.context.font = "20px 'serif'";
        this.context.strokeStyle = "rgb(0,0,0)";
        this.context.fillText(near.toString(), 0, this.position(near, median, absmax) - 5);
        this.context.moveTo(0, this.position(near, median, absmax));
        this.context.lineTo(this.canvas.width, this.position(near, median, absmax));
        this.context.stroke();

        /*
        this.context.fillText((near - 20).toString(), 0, this.position(near - 20, median, absmax) - 5);
        this.context.moveTo(0, this.position(near - 20, median, absmax));
        this.context.lineTo(this.canvas.width, this.position(near - 20, median, absmax));
        this.context.fillText((near - 10).toString(), 0, this.position(near - 10, median, absmax) - 5);
        this.context.moveTo(0, this.position(near - 10, median, absmax));
        this.context.lineTo(this.canvas.width, this.position(near - 10, median, absmax));
        this.context.fillText((near + 10).toString(), 0, this.position(near + 10, median, absmax) - 5);
        this.context.moveTo(0, this.position(near + 10, median, absmax));
        this.context.lineTo(this.canvas.width, this.position(near + 10, median, absmax));
        this.context.fillText((near + 20).toString(), 0, this.position(near + 20, median, absmax) - 5);
        this.context.moveTo(0, this.position(near + 20, median, absmax));
        this.context.lineTo(this.canvas.width, this.position(near + 20, median, absmax));
        this.context.stroke();
        */
        var distance = 10;

        this.context.strokeStyle = "rgb(192,192,192)";
        for (var i = 0; i <= this.canvas.width; i += distance * 2) {
            this.context.moveTo(i, 0);
            this.context.lineTo(i, this.canvas.height);
        }
        this.context.stroke();

        this.context.strokeStyle = "rgb(32,32,32)";
        this.context.beginPath();
        for (var i = array.length; i >= 0; i--) {
            this.context.lineTo(this.canvas.width - (i - 1) * distance, this.position(array[array.length - i], median, absmax));
        }
        this.context.stroke();

        for (var i = array.length; i >= 0; i--) {
            this.context.beginPath();
            this.context.arc(this.canvas.width - (i - 1) * distance, this.position(array[array.length - i], median, absmax), 2, 0, Math.PI * 2, false);
            this.context.fill();
        }
    };

    Graph.prototype.start = function () {
        var _this = this;
        this.Draw();
        this.timerToken = setInterval(function () {
            _this.Draw();
        }, 5000);
    };
    return Graph;
})();
//@ sourceMappingURL=app.js.map
