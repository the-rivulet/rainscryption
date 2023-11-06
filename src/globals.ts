export let getImg = (name: string) => document.getElementById(name) as HTMLImageElement;
export let fudge = (value: number, change: number) => Math.floor(Math.random() * (2 * change + 2)) + value - change;

export function choice<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function shuffle(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export let mouse = {realX: 0, realY: 0, adjustedX: 0, adjustedY: 0};
document.onmousemove = function(e) {
    mouse.realX = e.clientX;
    mouse.realY = e.clientY;
    mouse.adjustedX = e.clientX - document.getElementById("canvas").offsetLeft;
    mouse.adjustedY = e.clientY - document.getElementById("canvas").offsetTop;
}

export enum Cost {
    blood = "blood",
    bones = "bones",
    energy = "energy"
}

export enum Zone {
    limbo = "limbo",
    drawPile = "drawPile",
    hand = "hand",
    sideDeckPile = "sideDeckPile",
    battlefield = "battlefield"
}

export enum Player {
    you = "you",
    leshy = "leshy"
}

export enum Sigil {
    airborne = "airborne",
    worthySacrifice = "worthy sacrifice"
}