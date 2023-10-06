import { Card, Cost } from "./card.js";
import { Player } from "./globals.js";
export let library = {
    stoat: (owner = Player.you) => new Card("Stoat", 1, Cost.blood, owner)
};
