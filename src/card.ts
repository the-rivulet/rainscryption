import { Zone, Player, Cost, fudge, mouse, Sigil } from "./globals.js";
import { Game } from "./game.js";

class CardVisuals {
    pileOffsetX = fudge(0, 6);
    pileOffsetY = fudge(0, 6);
    handX = 675;
    handOffsetY = fudge(0, 10);
    handY = 450;
    opacity = 1;
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
    column = 0;
    fadeTime = 0;
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
            if(Game.battlefield.filter(x => x.owner == Player.you).length < this.cost) return false;
            // do not actually move the card
            Game.hand.splice(Game.hand.indexOf(this), 1);
            Game.currentlyPlaying = this;
            if(this.cost) Game.leshyText = `The ${this.name} demands ${this.cost} sacrifice${this.cost == 1 ? "" : "s"}.`;
            else Game.leshyText = "The " + this.name + " is free.";
            return true;
        } else {
            return false; // NYI
        }
    }
    moveTo(destination: Zone) {
        if(this.zone == destination) return;
        if(this.zone == Zone.battlefield) {
            Game.battlefield.splice(Game.battlefield.indexOf(this), 1);
            Game.fadingCards.push(this);
        }
        if(destination == Zone.battlefield) {
            Game.battlefield.push(this);
        }
        this.zone = destination;
    }
    sacrifice() {
        Game.leshyText = "The " + this.name + " was sacrificed.";
        Game.bloodPaid++;
        this.moveTo(Zone.limbo);
    }
    playAt(column: number) {
        this.row = 3;
        this.column = column;
        this.moveTo(Zone.battlefield);
        Game.leshyText = "You've played the " + this.name + ".";
    }
    isHovering(checkNext = true) {
        if(this.zone != Zone.hand) return false;
        let valid = mouse.adjustedX > this.viz.handX && mouse.adjustedX < this.viz.handX + 169 && mouse.adjustedY > this.viz.handY && mouse.adjustedY < 600;
        if(!valid) return false;
        if(!checkNext) return true;
        let next = Game.hand[Game.hand.indexOf(this) + 1];
        if(next && next.isHovering(false)) return false;
        return true;
    }
    addSigil(sigil: Sigil) {
        this.sigils.push(sigil);
        return this;
    }
}