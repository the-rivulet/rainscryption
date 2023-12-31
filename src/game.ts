import type { Card } from "card.js";
import { Zone, Cost, choice, mouse } from "./globals.js";
import { bestiary } from "./bestiary.js";

class Game {
    deck: Card[] = [];
    inCombat = false;
    hand: Card[] = [];
    drawPile: Card[] = [];
    sideDeckPile: Card[] = [];
    battlefield: Card[] = [];
    incomingCards: Card[] = [];
    damage = 0;
    currentlyPlaying: Card;
    bloodPaid = 0;
    leshyText = "";
    startCombat() {
        this.inCombat = true;
        this.hand = [];
        this.drawPile = [];
        this.sideDeckPile = [];
        this.damage = 0;
        // Create side deck
        while(this.sideDeckPile.length < 10) {
            let squirrel = bestiary.squirrel();
            squirrel.moveTo(Zone.sideDeckPile);
            this.sideDeckPile.push(squirrel);
        }
        // Add a squirrel
        let squirrel = bestiary.squirrel();
        squirrel.moveTo(Zone.hand);
        this.hand.push(squirrel);
        // Pick a random card that costs 1 blood (or less), if there is one
        let oneBlood = this.deck.filter(x => x.cost <= 1 && x.costType == Cost.blood);
        if(oneBlood.length) {
            let c = choice(oneBlood);
            c.moveTo(Zone.hand);
            this.hand.push(choice(oneBlood));
        }
        // Move add'l cards to hand
        while(this.hand.length < 4) {
            let remain = this.deck.filter(x => x.zone == Zone.limbo);
            if(remain.length) {
                let c = choice(remain);
                c.moveTo(Zone.hand);
                this.hand.push(c);
            }
        }
        // Move remaining cards to draw pile
        for(let i of this.deck.filter(x => x.zone == Zone.limbo)) {
            i.moveTo(Zone.drawPile);
            this.drawPile.push(i);
        }
    }
    // 220 280 340 430
    get hoveredRow() {
        if(mouse.adjustedY < 220) return 0;
        if(mouse.adjustedY < 280) return 1;
        if(mouse.adjustedY < 340) return 2;
        if(mouse.adjustedY < 430) return 3;
        return 0;
    }
    get hoveredColumn() {
        if(mouse.adjustedX < 450) return 0;
        if(mouse.adjustedX < 600) return 1;
        if(mouse.adjustedX < 750) return 2;
        if(mouse.adjustedX < 900) return 3;
        if(mouse.adjustedX < 1050) return 4;
        return 0;
    }
}

export let game = new Game();