$(document).ready(function () {
// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

    var canvas, context, toggle;

    init();
    animate();

    function init() {

        canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;

        context = canvas.getContext('2d');

        document.body.appendChild(canvas);

    }

    function animate() {
        requestAnimFrame(animate);
        draw();

    }

    function draw() {
        var randX = Math.random();
        var time = new Date().getTime() * 0.002;
        var x = Math.sin(time) * 192 + randX;
        var y = Math.cos(time * 0.9) * randX + 256;
        toggle = !toggle;

        //context.fillStyle = toggle ? 'rgb(200,200,20)' : 'rgb(20,20,200)';
        context.fillStyle = toggle ? 'rgba(240,240,240,0.85)' : 'rgba(248,248,248,0.85)';
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

    }
});