import { transform } from "../node_modules/typescript/lib/typescript";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

function drawTrapezoid(img: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | OffscreenCanvas, dx: number, dy: number, t: number, b: number, yMult: number, flip = false) {
    for(let y = 0; y < img.height; y++) {
        let py = y / img.height;
        let sx = (1 - py) * t + py * b;
        let w = img.width * sx;
        let x = img.width / 2 - w / 2;
        context.drawImage(img, 0, y, img.width, 1, dx + x, dy + (flip ? img.height - y : y) * yMult, w, yMult);
    }
}

function clearCanvas() {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Floor
    let f1 = document.getElementById("floor1") as HTMLImageElement;
    let f2 = document.getElementById("floor2") as HTMLImageElement;
    context.globalAlpha = 0.7;
    context.drawImage(f1, 0, 400, 1350, 200);
    const height = 400;
    context.drawImage(f2, 0, 400 - height, 800, height);
    context.drawImage(f2, 300, 0, f2.width - 300, f2.height, 800, 400 - height, 550, height);
    context.globalAlpha = 1;
    let gradient = context.createRadialGradient(675, 900, 0, 675, 900, 800);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1350, 675); // Fill rectangle over image with the gradient
    // Scales
    let scales = document.getElementById("scales") as HTMLImageElement;
    context.drawImage(scales, 150, 0);
    let meter = document.getElementById("meter") as HTMLImageElement;
    // Meter rotates based on damage
    context.drawImage(meter, 330, 5);
    context.translate(340, 80);
    context.rotate(50);
    context.translate(-340, -80);
    context.drawImage(meter, 330, 5);
    context.translate(340, 80);
    context.rotate(-100);
    context.translate(-340, -80);
    context.drawImage(meter, 330, 5);
    context.rotate(50);
    context.restore();
}

function drawBattleBoard() {
    let paw = document.getElementById("boardpaw") as HTMLImageElement;
    // Your side
    for(let i = 0; i < 4; i++) {
        context.setTransform(1, 0, -0.55 + 0.5 * i, 1, 0, 0);
        drawTrapezoid(paw, 700 - 50 * i, 345, 1.2, 1.6, 0.65);
    }
    // Opponent's side
    for(let i = 0; i < 4; i++) {
        context.setTransform(1, 0, -0.55 + 0.5 * i, 1, 0, 0);
        drawTrapezoid(paw, 700 - 50 * i, 280, 1.14, 0.85, 0.4, true);
    }
    // Incoming
    let inc = document.getElementById("incoming") as HTMLImageElement;
    for(let i = 0; i < 4; i++) {
        context.setTransform(1, 0, -0.55 + 0.5 * i, 1, 0, 0);
        drawTrapezoid(inc, 647 - 50 * i, 217, 0.35, 0.4, 0.65);
    }
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