import { Game } from "./game.js";
import { Cost, getImg, mouse } from "./globals.js";
import { bestiary } from "./bestiary.js";
let bgCanvas;
let bgContext;
let canvas;
let context;
let fgCanvas;
let fgContext;
function drawTrapezoid(img, dx, dy, t, b, yMult = 1, flip = false) {
    for (let y = 0; y < img.height; y++) {
        let py = y / img.height;
        let sx = (1 - py) * t + py * b;
        let w = img.width * sx;
        let x = img.width / 2 - w / 2;
        context.drawImage(img, 0, y, img.width, 1, dx + x, dy + (flip ? img.height - y : y) * yMult, w, yMult);
    }
}
document.onclick = function (e) {
    for (let i of Game.hand) {
        if (i.isHovering())
            i.click();
    }
    //alert("Clicked at " + mouse.adjustedX + ", " + mouse.adjustedY);
    if (Game.hoveredRow == 3 && Game.hoveredColumn) {
        if (Game.currentlyPlaying && Game.currentlyPlaying.costType == Cost.blood) {
            if (Game.bloodPaid >= Game.currentlyPlaying.cost && !Game.hoveredCard) {
                Game.currentlyPlaying.playAt(Game.hoveredColumn);
                Game.currentlyPlaying = undefined;
            }
            else if (Game.bloodPaid < Game.currentlyPlaying.cost && Game.hoveredCard) {
                Game.hoveredCard.sacrifice();
                if (Game.bloodPaid >= Game.currentlyPlaying.cost) {
                    Game.leshyText = "The " + Game.hoveredCard.name + "'s cost is paid.";
                }
            }
        }
    }
    else if (mouse.adjustedX > 280 && mouse.adjustedY < 400 && mouse.adjustedY > 300 && mouse.adjustedY < 450) {
        Game.ringBell();
    }
};
function updateCanvas() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
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
    // Draw piles
    let back = getImg("back");
    for (let i of Game.drawPile) {
        context.setTransform(1, 0, 0.95, 1, 0, 0);
        drawTrapezoid(back, 600 + i.viz.pileOffsetX, 450 + i.viz.pileOffsetY, 1.6, 2.1);
    }
    let squirrelBack = getImg("squirrel-back");
    for (let i of Game.sideDeckPile) {
        context.setTransform(1, 0, 1.35, 1, 0, 0);
        drawTrapezoid(squirrelBack, 560 + i.viz.pileOffsetX, 450 + i.viz.pileOffsetY, 1.6, 2.1);
    }
    let blankCard = getImg("blank-card");
    if (Game.currentlyPlaying) {
        let cp = Game.currentlyPlaying;
        cp.viz.handX += 0.3 * (300 - cp.viz.handX);
        cp.viz.handY += 0.3 * (450 - cp.viz.handY);
        context.setTransform(1, 0, -0.85, 1, 0, 0);
        drawTrapezoid(blankCard, cp.viz.handX + 170, cp.viz.handY, 0.2, 0.26, 0.13);
        context.fillStyle = "black";
        context.font = "16px Heavyweight Regular";
        context.fillText(cp.name, cp.viz.handX + 490 - 3.4 * cp.name.length, cp.viz.handY + 17);
        // Get the proper cost symbol
        let costSymbol = getImg(cp.cost + cp.costType);
        if (costSymbol) {
            context.drawImage(costSymbol, cp.viz.handX + 550 - costSymbol.width * 0.25, cp.viz.handY + 25, costSymbol.width * 0.25, costSymbol.height * 0.25);
        }
        // Draw power and health
        context.font = "26px Heavyweight Regular";
        context.fillText(cp.power.toString(), cp.viz.handX + 428, cp.viz.handY + 105);
        if (cp.currentHealth < cp.baseHealth)
            context.fillStyle = "darkred";
        context.fillText(cp.currentHealth.toString(), cp.viz.handX + 540, cp.viz.handY + 115);
        // Sigils
        let sigils = cp.sigils.map(x => getImg(x));
        if (cp.sigils.length == 1) {
            context.drawImage(sigils[0], cp.viz.handX + 470, cp.viz.handY + 85, 35, 35);
        }
    }
    for (let i of Game.fadingCards) {
        i.viz.opacity -= 0.15;
        if (i.viz.opacity < 0) {
            i.viz.opacity = 0;
            Game.fadingCards.splice(Game.fadingCards.indexOf(i), 1);
        }
    }
    for (let i of [...Game.fadingCards, ...Game.battlefield]) {
        let c = i.column - 1;
        let goalX = 425 - 50 * c;
        i.viz.handX += 0.3 * (goalX - i.viz.handX);
        let goalY = [0, 225, 280, 345][i.row];
        i.viz.handY += 0.3 * (goalY - i.viz.handY);
        let effectiveRow = (i.viz.handY - 200) / 75;
        let multiX = 345 / (3000 - 500 * effectiveRow);
        let multiY = multiX * 0.53;
        //let multiX = [0, 0.075, 0.11, 0.17][i.row];
        //let multiY = [0, 0.045, 0.05, 0.09][i.row];
        context.setTransform(1, 0, -0.55 + 0.5 * c, 1, 0, 0);
        context.globalAlpha = i.viz.opacity;
        drawTrapezoid(blankCard, i.viz.handX, i.viz.handY, multiX, multiX * 1.3, multiY);
        context.fillStyle = "black";
        context.font = "13px Heavyweight Regular";
        context.fillText(i.name, i.viz.handX + 325 - 2.8 * i.name.length, i.viz.handY + 13);
        /*let costSymbol = getImg("1blood"); //getImg(i.cost + i.costType);
        if(costSymbol) {
            drawTrapezoid(costSymbol, i.viz.handX + 295, i.viz.handY + 15, 0.28, 0.28 * 1.3, 0.18);
        }*/
        // Power and health
        context.font = "18px Heavyweight Regular";
        context.fillText(i.power.toString(), i.viz.handX + 268, i.viz.handY + 77);
        if (i.currentHealth < i.baseHealth)
            context.fillStyle = "darkred";
        context.fillText(i.currentHealth.toString(), i.viz.handX + 365, i.viz.handY + 80);
    }
    context.globalAlpha = 1;
    // Draw the hand
    for (let i of Game.hand) {
        // Fix X position
        let baseX = 675 + 70 * (Game.hand.indexOf(i) - 0.5 * Game.hand.length);
        let goalX = baseX + (i.isHovering() ? -50 : Game.hand.filter(x => x.isHovering(false)).length == 0 ? 0 : mouse.adjustedX > baseX ? -50 : 50);
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
        if (costSymbol) {
            context.drawImage(costSymbol, i.viz.handX + 160 - costSymbol.width * 0.32, i.viz.handY + 50, costSymbol.width * 0.32, costSymbol.height * 0.32);
        }
        // Draw power and health
        context.font = "40px Heavyweight Regular";
        context.fillText(i.power.toString(), i.viz.handX + 19, i.viz.handY + 217);
        if (i.currentHealth < i.baseHealth)
            context.fillStyle = "darkred";
        context.fillText(i.currentHealth.toString(), i.viz.handX + 137, i.viz.handY + 230);
        // Sigils
        let sigils = i.sigils.map(x => getImg(x));
        if (i.sigils.length == 1) {
            context.drawImage(sigils[0], i.viz.handX + 50, i.viz.handY + 176, 70, 70);
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
    let deg = 8 * Game.damage - 1;
    fgContext.setTransform(1, 0, 0, 1, 0, 0);
    fgContext.translate(340, 80);
    fgContext.scale(1, 0.9 - deg * 0.003);
    fgContext.rotate(deg * Math.PI / 180);
    fgContext.translate(-340, -80);
    fgContext.drawImage(meter, 330, 5);
    fgContext.fillStyle = "orange";
    fgContext.font = "30px Heavyweight Regular";
    fgContext.setTransform(1, 0, 0, 1, 0, 0);
    fgContext.fillText(Game.leshyText, 675 - 5.7 * Game.leshyText.length, 40);
}
export function startGame() {
    try {
        bgCanvas = document.getElementById("bg-canvas");
        bgContext = bgCanvas.getContext("2d");
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        fgCanvas = document.getElementById("fg-canvas");
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
        for (let i of deck) {
            Game.deck.push(i);
        }
        Game.leshyText = "Another challenger... it has been ages. Perhaps you have forgotten how this game is played. Allow me to remind you.";
        Game.startCombat();
        setInterval(updateCanvas, 33);
    }
    catch (e) {
        alert(e);
    }
}
