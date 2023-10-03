let canvas;
let context;
function drawTrapezoid(img, dx, dy, t, b, yMult) {
    for (let y = 0; y < img.height; y++) {
        let py = y / img.height;
        let sx = (1 - py) * t + py * b;
        let w = img.width * sx;
        let x = img.width / 2 - w / 2;
        context.drawImage(img, 0, y, img.width, 1, dx + x, dy + y * yMult, w, yMult);
    }
}
function clearCanvas() {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the floor
    /*let floor = document.getElementById("floor") as HTMLImageElement;
    for(let x = 0; x < canvas.width; x += floor.width) {
        for(let y = 0; y < canvas.height; y + floor.height) {
            alert("Drew image " + floor.width + " x " + floor.height + " out of " + canvas.width + " x " + canvas.height);
            context.drawImage(floor, x, y);
        }
    }*/
    context.restore();
}
function drawBattleBoard() {
    context.setTransform(1, 0, -0.55, 1, 0, 0);
    drawTrapezoid(document.getElementById("boardpaw"), 700, 345, 1.2, 1.6, 0.65);
    context.setTransform(1, 0, -0.05, 1, 0, 0);
    drawTrapezoid(document.getElementById("boardpaw"), 650, 345, 1.2, 1.6, 0.65);
}
export function init() {
    try {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        clearCanvas();
        drawBattleBoard();
    }
    catch (e) {
        alert(e);
    }
}
