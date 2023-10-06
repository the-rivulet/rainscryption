import { Zone, Player, Cost, fudge, mouse, Sigil } from "./globals.js";
import { game } from "./game.js";

class CardVisuals {
    pileOffsetX = fudge(0, 6);
    pileOffsetY = fudge(0, 6);
    handX = 675;
    handOffsetY = fudge(0, 10);
    handY = 450;
}

export class Card {
    name: string;
    owner: Player;
    cost: number;
    costType: Cost;
    zone = Zone.limbo;
    viz = new CardVisuals();
    power: number;
    baseHealth: number;
    currentHealth: number;
    sigils: Sigil[] = [];
    row = 0;
    constructor(name: string, cost: number, costType: Cost, power: number, health: number, owner = Player.you) {
        this.name = name;
        this.cost = cost;
        this.costType = costType;
        this.power = power;
        this.baseHealth = health;
        this.currentHealth = health;
        this.owner = owner;
    }
    click() {
        if(this.costType == Cost.blood) {
            if(game.battlefield.filter(x => x.owner == Player.you).length < this.cost) return false;
            game.hand.splice(game.hand.indexOf(this), 1);
            game.currentlyPlaying = this;
            game.leshyText = "Choose a row for the " + this.name + ".";
            return true;
        } else {
            return false; // NYI
        }
    }
    moveTo(destination: Zone) {
        this.zone = destination;
    }
    isHovering(checkNext = true) {
        if(this.zone != Zone.hand) return false;
        let valid = mouse.adjustedX > this.viz.handX && mouse.adjustedX < this.viz.handX + 169 && mouse.adjustedY > this.viz.handY && mouse.adjustedY < 600;
        if(!valid) return false;
        if(!checkNext) return true;
        let next = game.hand[game.hand.indexOf(this) + 1];
        if(next && next.isHovering(false)) return false;
        return true;
    }
    addSigil(sigil: Sigil) {
        this.sigils.push(sigil);
        return this;
    }
}