var Graph = (function () {
    function Graph(canvasId, dataOffset, dataURL) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.dataOffset = dataOffset;
        this.dataURL = dataURL;

        this.context.fillStyle = "rgb(0,0,0)";
        this.context.strokeStyle = "rgb(32,32,32)";

        this.offset = 20;
        this.distance = 5;
    }
    Graph.prototype.position = function (value) {
        var v = (value - this.median) / this.absmax;
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
            var str = line.split(',')[_this.dataOffset];
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

        this.median = median;
        if (absmax > 0.1) {
            this.absmax = absmax;
        } else {
            this.absmax = 0.1;
        }
        this.isDrawDeci = (this.absmax < 1);
        this.isDrawOne = (this.absmax < 10);

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var nearTen = Math.round(median / 10 + 0.5) * 10;
        var nearOne = Math.round(median + 0.5);

        this.context.font = "20px 'sans-serif'";
        this.context.strokeStyle = "rgb(0,0,0)";
        for (var i = nearTen - 10; i <= nearTen + 10; i += 10) {
            this.context.fillText(i.toString(), 0, this.position(i) + 6);
            this.context.moveTo(this.offset, this.position(i));
            this.context.lineTo(this.canvas.width, this.position(i));
        }
        this.context.stroke();

        if (this.isDrawOne) {
            this.context.font = "12px 'sans-serif'";
            this.context.strokeStyle = "rgb(32,32,32)";
            for (var i = nearOne - 10; i <= nearOne + 10; i += 1) {
                if (i % 10 != 0) {
                    this.context.fillText(i.toString(), 0, this.position(i) + 4);
                    this.context.moveTo(this.offset, this.position(i));
                    this.context.lineTo(this.canvas.width, this.position(i));
                }
            }
            this.context.stroke();
        }

        if (this.isDrawDeci) {
            this.context.strokeStyle = "rgb(192,192,192)";
            for (var i = nearOne - 10; i <= nearOne + 10; i += 0.1) {
                if (nearOne != i && (i % 10 != 0)) {
                    this.context.moveTo(this.offset, this.position(i));
                    this.context.lineTo(this.canvas.width, this.position(i));
                }
            }
            this.context.stroke();
        }

        this.context.strokeStyle = "rgb(192,192,192)";
        for (var i = this.canvas.width; i > 0; i -= this.distance * 30) {
            this.context.moveTo(i, 0);
            this.context.lineTo(i, this.canvas.height);
        }
        this.context.stroke();

        this.context.strokeStyle = "rgb(32,32,32)";
        this.context.beginPath();
        for (var i = array.length; i >= 0; i--) {
            this.context.lineTo(this.canvas.width - (i - 1) * this.distance, this.position(array[array.length - i]));
        }
        this.context.stroke();
    };

    Graph.prototype.Start = function () {
        var _this = this;
        this.Draw();
        this.timerToken = setInterval(function () {
            _this.Draw();
        }, 20000);
    };
    return Graph;
})();
