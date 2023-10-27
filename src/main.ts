import { game } from "./game.js";
import { Cost, Zone, getImg, mouse } from "./globals.js";
import { bestiary } from "./bestiary.js";

let bgCanvas: HTMLCanvasElement;
let bgContext: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let fgCanvas: HTMLCanvasElement;
let fgContext: CanvasRenderingContext2D;

function drawTrapezoid(img: HTMLImageElement, dx: number, dy: number, t: number, b: number, yMult = 1, flip = false) {
    for(let y = 0; y < img.height; y++) {
        let py = y / img.height;
        let sx = (1 - py) * t + py * b;
        let w = img.width * sx;
        let x = img.width / 2 - w / 2;
        context.drawImage(img, 0, y, img.width, 1, dx + x, dy + (flip ? img.height - y : y) * yMult, w, yMult);
    }
}

document.onclick = function(e) {
    for(let i of game.hand) {
        if(i.isHovering()) i.click();
    }
    if(game.hoveredRow == 3 && game.hoveredColumn && game.currentlyPlaying &&
        (game.currentlyPlaying.costType == Cost.blood && game.bloodPaid >= game.currentlyPlaying.cost)
    ) {
        //alert("Clicked @ " + mouse.adjustedX + "," + mouse.adjustedY);
        game.currentlyPlaying.row = 3;
        game.currentlyPlaying.column = game.hoveredColumn;
        game.currentlyPlaying.moveTo(Zone.battlefield);
        game.battlefield.push(game.currentlyPlaying);
        game.currentlyPlaying = undefined;
    }
}

function updateCanvas() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    let paw = getImg("boardpaw");
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
    let inc = getImg("incoming");
    for(let i = 0; i < 4; i++) {
        context.setTransform(1, 0, -0.55 + 0.5 * i, 1, 0, 0);
        drawTrapezoid(inc, 647 - 50 * i, 217, 0.35, 0.4, 0.65);
    }
    // Draw piles
    let back = getImg("back");
    for(let i of game.drawPile) {
        context.setTransform(1, 0, 0.95, 1, 0, 0);
        drawTrapezoid(back, 600 + i.viz.pileOffsetX, 450 + i.viz.pileOffsetY, 1.6, 2.1);
    }
    let squirrelBack = getImg("squirrel-back");
    for(let i of game.sideDeckPile) {
        context.setTransform(1, 0, 1.35, 1, 0, 0);
        drawTrapezoid(squirrelBack, 560 + i.viz.pileOffsetX, 450 + i.viz.pileOffsetY, 1.6, 2.1);
    }
    let blankCard = getImg("blank-card");
    if(game.currentlyPlaying) {
        let cp = game.currentlyPlaying;
        cp.viz.handX += 0.3 * (300 - cp.viz.handX);
        cp.viz.handY += 0.3 * (450 - cp.viz.handY);
        context.setTransform(1, 0, -0.85, 1, 0, 0);
        drawTrapezoid(blankCard, cp.viz.handX + 170, cp.viz.handY, 0.2, 0.26, 0.13);
        context.fillStyle = "black";
        context.font = "16px Heavyweight Regular";
        context.fillText(cp.name, cp.viz.handX + 490 - 3.4 * cp.name.length, cp.viz.handY + 17);
        // Get the proper cost symbol
        let costSymbol = getImg(cp.cost + cp.costType);
        if(costSymbol) {
            context.drawImage(costSymbol, cp.viz.handX + 550 - costSymbol.width * 0.32, cp.viz.handY - 1, costSymbol.width * 0.32, costSymbol.height * 0.32);
        }
        // Draw power and health
        context.font = "26px Heavyweight Regular";
        context.fillText(cp.power.toString(), cp.viz.handX + 428, cp.viz.handY + 105);
        if(cp.currentHealth < cp.baseHealth) context.fillStyle = "darkred";
        context.fillText(cp.currentHealth.toString(), cp.viz.handX + 540, cp.viz.handY + 115);
        // Sigils
        let sigils = cp.sigils.map(x => getImg(x));
        context.globalAlpha = 1;
        if(cp.sigils.length == 1) {
            context.drawImage(sigils[0], cp.viz.handX + 470, cp.viz.handY + 85, 35, 35);
        }
        context.globalAlpha = 1;
    }
    // Draw the hand
    for(let i of game.hand) {
        // Fix X position
        let baseX = 675 + 70 * (game.hand.indexOf(i) - 0.5 * game.hand.length);
        let goalX = baseX + (i.isHovering() ? -50 : game.hand.filter(x => x.isHovering(false)).length == 0 ? 0 : mouse.adjustedX > baseX ? -50 : 50);
        i.viz.handX += 0.3 * (goalX - i.viz.handX);
        let goalY = 450 - (i.isHovering() ? 100 : 0);
        i.viz.handY += 0.3 * (goalY - i.viz.handY);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(blankCard, i.viz.handX, i.viz.handY, 169, 256);
        context.fillStyle = "black";
        context.font = "26px Heavyweight Regular";
        context.fillText(i.name, i.viz.handX + 90 - 5.6 * i.name.length, i.viz.handY + 35);
        // Get the proper cost symbol
        let costSymbol = getImg(i.cost + i.costType);
        if(costSymbol) {
            context.drawImage(costSymbol, i.viz.handX + 160 - costSymbol.width * 0.32, i.viz.handY + 50, costSymbol.width * 0.32, costSymbol.height * 0.32);
        }
        // Draw power and health
        context.font = "40px Heavyweight Regular";
        context.fillText(i.power.toString(), i.viz.handX + 19, i.viz.handY + 217);
        if(i.currentHealth < i.baseHealth) context.fillStyle = "darkred";
        context.fillText(i.currentHealth.toString(), i.viz.handX + 137, i.viz.handY + 230);
        // Sigils
        let sigils = i.sigils.map(x => getImg(x));
        if(i.sigils.length == 1) {
            context.drawImage(sigils[0], i.viz.handX + 50, i.viz.handY + 176, 70, 70);
        }
    }
    for(let i of game.battlefield) {
        let c = i.column - 1;
        let goalX = 425 - 50 * c;
        i.viz.handX += 0.3 * (goalX - i.viz.handX);
        let goalY = [0, 225, 280, 345][i.row];
        i.viz.handY += 0.3 * (goalY - i.viz.handY);
        let multiX = [0, 0.075, 0.11, 0.17][i.row];
        let multiY = [0, 0.045, 0.05, 0.09][i.row];
        context.setTransform(1, 0, -0.55 + 0.5 * c, 1, 0, 0);
        drawTrapezoid(blankCard, i.viz.handX, i.viz.handY, multiX, multiX * 1.3, multiY);
        context.fillStyle = "black";
        context.font = "13px Heavyweight Regular";
        context.fillText(i.name, i.viz.handX + 325 - 2.8 * i.name.length, i.viz.handY + 13);
        let costSymbol = getImg("1blood"); //getImg(i.cost + i.costType);
        if(costSymbol) {
            drawTrapezoid(costSymbol, i.viz.handX + 295, i.viz.handY + 15, 0.28, 0.28 * 1.3, 0.18);
        }
    }

    // FG
    fgContext.setTransform(1, 0, 0, 1, 0, 0);
    fgContext.clearRect(0, 0, canvas.width, canvas.height);
    let gradient = fgContext.createRadialGradient(675, 1100, 0, 675, 1100, 1290);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.6, "rgba(0,0,0,0)");
    gradient.addColorStop(0.8, "rgba(0,0,0,1)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");
    fgContext.fillStyle = gradient;
    fgContext.fillRect(0, 0, 1350, 675);
    // Scales
    let scales = getImg("scales");
    fgContext.drawImage(scales, 150, 0);
    let meter = getImg("meter");
    // Meter rotates based on damage
    let deg = 8 * game.damage - 1;
    fgContext.setTransform(1, 0, 0, 1, 0, 0);
    fgContext.translate(340, 80);
    fgContext.scale(1, 0.9 - deg * 0.003);
    fgContext.rotate(deg * Math.PI / 180);
    fgContext.translate(-340, -80);
    fgContext.drawImage(meter, 330, 5);
    fgContext.fillStyle = "orange";
    fgContext.font = "30px Heavyweight Regular";
    fgContext.setTransform(1, 0, 0, 1, 0, 0);
    fgContext.fillText(game.leshyText, 675 - 5.7 * game.leshyText.length, 40);
}

export function startGame() {
    try {
        bgCanvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
        bgContext = bgCanvas.getContext("2d");
        canvas = document.getElementById("canvas") as HTMLCanvasElement;
        context = canvas.getContext("2d");
        fgCanvas = document.getElementById("fg-canvas") as HTMLCanvasElement;
        fgContext = fgCanvas.getContext("2d");
        // Floor
        let f1 = getImg("floor1");
        let f2 = getImg("floor2");
        bgContext.drawImage(f2, 0, 100, 1350, 300);
        bgContext.drawImage(f1, 0, 400, 1350, 200);
        // Set up deck
        let deck = [
            bestiary.stoat(),
            bestiary.wolf(),
            bestiary.wolf(),
            bestiary.turkeyVulture(),
            bestiary.turkeyVulture()
        ];
        for(let i of deck) {
            game.deck.push(i);
        }
        game.leshyText = "Another challenger... it has been ages. Perhaps you have forgotten how this game is played. Allow me to remind you.";
        game.startCombat();
        setInterval(updateCanvas, 33);
    } catch(e) {
        alert(e);
    }
}