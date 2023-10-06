import { Zone, Cost, choice } from "./globals.js";
import { bestiary } from "./bestiary.js";
class Game {
    deck = [];
    inCombat = false;
    hand = [];
    drawPile = [];
    sideDeckPile = [];
    battlefield = [];
    incomingCards = [];
    damage = 0;
    currentlyPlaying;
    leshyText = "";
    startCombat() {
        this.inCombat = true;
        this.hand = [];
        this.drawPile = [];
        this.sideDeckPile = [];
        this.damage = 0;
        // Create side deck
        while (this.sideDeckPile.length < 10) {
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
        if (oneBlood.length) {
            let c = choice(oneBlood);
            c.moveTo(Zone.hand);
            this.hand.push(choice(oneBlood));
        }
        // Move add'l cards to hand
        while (this.hand.length < 4) {
            let remain = this.deck.filter(x => x.zone == Zone.limbo);
            if (remain.length) {
                let c = choice(remain);
                c.moveTo(Zone.hand);
                this.hand.push(c);
            }
        }
        // Move remaining cards to draw pile
        for (let i of this.deck.filter(x => x.zone == Zone.limbo)) {
            i.moveTo(Zone.drawPile);
            this.drawPile.push(i);
        }
    }
}
export let game = new Game();
