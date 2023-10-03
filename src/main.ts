let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

function drawTrapezoid(img: HTMLImageElement, dx: number, dy: number, t: number, b: number, yMult: number) {
    for(let y = 0; y < img.height; y++) {
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
    context.restore();
}

function drawBattleBoard() {
    context.setTransform(1, 0, -0.55, 1, 0, 0);
    drawTrapezoid(document.getElementById("boardpaw") as HTMLImageElement, 700, 345, 1.2, 1.6, 0.65);
    context.setTransform(1, 0, -0.05, 1, 0, 0);
    drawTrapezoid(document.getElementById("boardpaw") as HTMLImageElement, 650, 345, 1.2, 1.6, 0.65);
}

export function init() {
    try {
        canvas = document.getElementById("canvas") as HTMLCanvasElement;
        context = canvas.getContext("2d");
        clearCanvas();
        drawBattleBoard();
    } catch(e) {
        alert(e);
    }
}