import { game } from "./game.js";
import { getImg, mouse } from "./globals.js";
import { bestiary } from "./bestiary.js";
let canvas;
let context;
function drawTrapezoid(img, dx, dy, t, b, yMult = 1, flip = false) {
    for (let y = 0; y < img.height; y++) {
        let py = y / img.height;
        let sx = (1 - py) * t + py * b;
        let w = img.width * sx;
        let x = img.width / 2 - w / 2;
        context.drawImage(img, 0, y, img.width, 1, dx + x, dy + (flip ? img.height - y : y) * yMult, w, yMult);
    }
}
function updateCanvas() {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Floor
    const height = 400;
    let f1 = getImg("floor1");
    let f2 = getImg("floor2");
    context.globalAlpha = 0.7;
    context.drawImage(f1, 0, 400, 1350, 200);
    context.drawImage(f2, 0, 400 - height, 800, height);
    context.drawImage(f2, 300, 0, f2.width - 300, f2.height, 800, 400 - height, 550, height);
    context.globalAlpha = 1;
    let gradient = context.createRadialGradient(675, 900, 0, 675, 900, 800);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1350, 675); // Fill rectangle over image with the gradient
    let paw = getImg("boardpaw");
    // Your side
    for (let i = 0; i < 4; i++) {
        context.setTransform(1, 0, -0.55 + 0.5 * i, 1, 0, 0);
        drawTrapezoid(paw, 700 - 50 * i, 345, 1.2, 1.6, 0.65);
    }
    // Opponent's side
    for (let i = 0; i < 4; i++) {
        context.setTransform(1, 0, -0.55 + 0.5 * i, 1, 0, 0);
        drawTrapezoid(paw, 700 - 50 * i, 280, 1.14, 0.85, 0.4, true);
    }
    // Incoming
    let inc = getImg("incoming");
    for (let i = 0; i < 4; i++) {
        context.setTransform(1, 0, -0.55 + 0.5 * i, 1, 0, 0);
        drawTrapezoid(inc, 647 - 50 * i, 217, 0.35, 0.4, 0.65);
    }
    // Scales
    let scales = getImg("scales");
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 0.85;
    context.drawImage(scales, 150, 0);
    let meter = getImg("meter");
    // Meter rotates based on damage
    let deg = 8 * game.damage - 1;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(340, 80);
    context.scale(1, 0.9 - deg * 0.003);
    context.rotate(deg * Math.PI / 180);
    context.translate(-340, -80);
    context.drawImage(meter, 330, 5);
    context.globalAlpha = 1;
    // Draw piles
    let back = getImg("back");
    for (let i of game.drawPile) {
        context.setTransform(1, 0, 0.95, 1, 0, 0);
        drawTrapezoid(back, 600 + i.viz.pileOffsetX, 450 + i.viz.pileOffsetY, 1.6, 2.1);
    }
    let squirrelBack = getImg("squirrel-back");
    for (let i of game.sideDeckPile) {
        context.setTransform(1, 0, 1.35, 1, 0, 0);
        drawTrapezoid(squirrelBack, 560 + i.viz.pileOffsetX, 450 + i.viz.pileOffsetY, 1.6, 2.1);
    }
    // Draw the hand
    let blankCard = getImg("blank-card");
    context.setTransform(1, 0, 0, 1, 0, 0);
    for (let i of game.hand) {
        // Fix X position
        let baseX = 675 + 70 * (game.hand.indexOf(i) - 0.5 * game.hand.length);
        let goalX = baseX + (i.isHovering() ? -50 : game.hand.filter(x => x.isHovering(false)).length == 0 ? 0 : mouse.adjustedX > baseX ? -50 : 50);
        i.viz.handX += 0.2 * (goalX - i.viz.handX);
        let goalY = 450 - (i.isHovering() ? 100 : 0);
        i.viz.handY += 0.2 * (goalY - i.viz.handY);
        context.drawImage(blankCard, i.viz.handX, i.viz.handY, 169, 256);
        context.fillStyle = "black";
        context.font = "26px Heavyweight Regular";
        // Put it approximately in the middle
        context.fillText(i.name, i.viz.handX + 90 - 5.6 * i.name.length, i.viz.handY + 35);
        // Get the proper cost symbol
        let costSymbol = getImg(i.cost + i.costType);
        if (costSymbol) {
            context.drawImage(costSymbol, i.viz.handX + 160 - costSymbol.width * 0.32, i.viz.handY + 50, costSymbol.width * 0.32, costSymbol.height * 0.32);
        }
        // Draw power and health
        context.font = "40px Heavyweight Regular";
        context.fillText(i.power.toString(), i.viz.handX + 17, i.viz.handY + 217);
        if (i.currentHealth < i.baseHealth)
            context.fillStyle = "darkred";
        context.fillText(i.currentHealth.toString(), i.viz.handX + 137, i.viz.handY + 230);
        // Sigils
        let sigils = i.sigils.map(x => getImg(x));
        if (i.sigils.length == 1) {
            context.drawImage(sigils[0], i.viz.handX + 50, i.viz.handY + 176, 70, 70);
        }
    }
    context.restore();
}
export function startGame() {
    try {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        let deck = [
            bestiary.stoat(),
            bestiary.wolf(),
            bestiary.wolf(),
            bestiary.turkeyVulture(),
            bestiary.turkeyVulture()
        ];
        for (let i of deck) {
            game.deck.push(i);
        }
        game.startCombat();
        setInterval(updateCanvas, 33);
    }
    catch (e) {
        alert(e);
    }
}
