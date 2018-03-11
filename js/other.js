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

    var img = new Image();
    img.src = 'https://orig00.deviantart.net/3f65/f/2014/247/2/8/2804a71d02566ba62b02647a5ab4b688-d7xy64k.gif';

    init();
    animate();
    var spriteWidth  = 350,
        spriteHeight = 170,
        pixelsLeft   = 170,
        pixelsTop    = 10,

        // Where are we going to draw
        // the sprite on the canvas
        canvasPosX   = 20,
        canvasPosY   = 20
    ;




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
        context.drawImage(img,
            pixelsLeft,
            pixelsTop,
            spriteWidth,
            spriteHeight,
            canvasPosX,
            canvasPosY,
            spriteWidth,
            spriteHeight
        );

    }
});