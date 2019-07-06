var canvas = document.getElementById('can');
var origin = [canvas.width / 2, canvas.height / 2, 1];
canvas.style.backgroundColor = 'black';
var context = canvas.getContext('2d');
var angleY = Math.PI / 3;
//var angleY = 1.3 * Math.PI;
var angleX = Math.PI / 9;
var balls = []
var array = [];
var analyser;

function rotateZ() {
    for (var i = 0; i < balls.length; i++) {
        var x1 = balls[i].x * Math.cos(angleZ) - balls[i].y * Math.sin(angleZ);
        var y1 = balls[i].y * Math.cos(angleZ) + balls[i].x * Math.sin(angleZ);
        balls[i].x = x1;
        balls[i].y = y1;
    }
}

function rotateX() {
    for (var i = 0; i < balls.length; i++) {
        var y1 = balls[i].y * Math.cos(angleX) - balls[i].z * Math.sin(angleX);
        var z1 = balls[i].z * Math.cos(angleX) + balls[i].y * Math.sin(angleX);
        balls[i].y = y1;
        balls[i].z = z1;
    }
}
function rotateY() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x = balls[i].x - 400;
        var x1 = balls[i].x * Math.cos(angleY) - balls[i].z * Math.sin(angleY) + 400;
        var z1 = balls[i].z * Math.cos(angleY) + balls[i].x * Math.sin(angleY);
        balls[i].x = x1;
        balls[i].z = z1;
    }
}
var particle = function (x, y, z, r, red, green, blue) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    this.red = red;
    this.green = green;
    this.blue = blue;
}
particle.prototype.draw = function () {
    var focus = 1360;
    context.save();
    context.beginPath();
    var alpha = 400 / (this.z + 400);
    if (alpha < 0) alpha = 1;
    var scale = focus / (focus + this.z);
    context.arc(this.x, this.y, this.r * scale, 0, 2 * Math.PI, true);
    context.fillStyle = "rgba(" + this.red + "," + this.green + "," + this.blue + "," + (alpha + 0.5) + ")";
    context.fill();
    context.restore();
}
function init(array) {
    //angleY = angleY + 0.001 * Math.PI;
    for (var i = 100; i < 920; i = i + 10) {
        var r = array[i - 100] + 30;
        var part = new particle(2 * i, 600, 0, 5, r + 20, 10, 44);
        balls.push(part);
        //r = 40;
        for (j = 600 - r; j < 600 + r; j = j + 20) {
            var part1 = new particle(2 * i, j, Math.sqrt(r * r - Math.pow(j - 600, 2)), 2, 13, 230, 164);
            var part2 = new particle(2 * i, j, - Math.sqrt(r * r - Math.pow(j - 600, 2)), 2, 13, 230, 164);
            balls.push(part1);
            balls.push(part2);
        }
        var pa = new particle(2 * i, 600 + r, - Math.sqrt(r * r - Math.pow(j - 600, 2)), 2, 13, 230, 164);
        balls.push(pa);
    }
    rotateY();
    rotateX();
    for (var m = 0; m < balls.length; m++) {
        balls[m].draw();
    }
    balls = [];

}
function update() {
    requestAnimationFrame(update);
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    context.clearRect(0, 0, canvas.width, canvas.height);
    init(array);
    balls = [];
}
function run() {
    requestAnimationFrame(update);
}
var button = document.getElementById('button');
button.addEventListener('click', () => {
    var audioContext = new window.AudioContext();
    var inputFile = document.getElementById('file').files[0];
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(inputFile);
    fileReader.onload = function (e) {
        var result = e.target.result;
        audioContext.decodeAudioData(result, (buffer) => {
            var source = audioContext.createBufferSource();
            analyser = audioContext.createAnalyser();
            source.buffer = buffer;
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            source.start(0);
            run();
        });
    }
});
