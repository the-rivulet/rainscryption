import { Card } from "./card.js";
import { Player, Cost, Sigil } from "./globals.js";

export let bestiary = {
    squirrel: (owner = Player.you) => new Card("Squirrel", 0, Cost.blood, 0, 1, owner).addSigil(Sigil.airborne),
    stoat: (owner = Player.you) => new Card("Stoat", 1, Cost.blood, 1, 3, owner),
    wolf: (owner = Player.you) => new Card("Wolf", 2, Cost.blood, 3, 2, owner),
    turkeyVulture: (owner = Player.you) => new Card("Turkey Vulture", 8, Cost.bones, 3, 3, owner).addSigil(Sigil.airborne)
}