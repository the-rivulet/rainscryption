export let getImg = (name) => document.getElementById(name);
export let fudge = (value, change) => Math.floor(Math.random() * (2 * change + 2)) + value - change;
export function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
export function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
export let mouse = { realX: 0, realY: 0, adjustedX: 0, adjustedY: 0 };
document.onmousemove = function (e) {
    mouse.realX = e.clientX;
    mouse.realY = e.clientY;
    mouse.adjustedX = e.clientX - document.getElementById("canvas").offsetLeft;
    mouse.adjustedY = e.clientY - document.getElementById("canvas").offsetTop;
};
export var Cost;
(function (Cost) {
    Cost["blood"] = "blood";
    Cost["bones"] = "bones";
    Cost["energy"] = "energy";
})(Cost || (Cost = {}));
export var Zone;
(function (Zone) {
    Zone["limbo"] = "limbo";
    Zone["drawPile"] = "drawPile";
    Zone["hand"] = "hand";
    Zone["sideDeckPile"] = "sideDeckPile";
    Zone["battlefield"] = "battlefield";
})(Zone || (Zone = {}));
export var Player;
(function (Player) {
    Player["you"] = "you";
    Player["leshy"] = "leshy";
})(Player || (Player = {}));
export var Sigil;
(function (Sigil) {
    Sigil["airborne"] = "airborne";
    Sigil["worthySacrifice"] = "worthy sacrifice";
})(Sigil || (Sigil = {}));
