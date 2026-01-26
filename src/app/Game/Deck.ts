import Color from "../enum/Color";
import Card from "../Game/Card";
import { shuffle } from "../utils/shuffle";


class Deck {
    private cards: Card[];

    constructor() {
        this.cards = this.createDeck();
    }

    private createDeck(): Card[] {
        const colors = [Color.RED, Color.GREEN, Color.BLUE, Color.YELLOW];
        const deck: Card[] = [];

        for (const color of colors) {
            for (let value = 0; value <= 9; value++) {
                deck.push(new Card(0, color, value));
            }
        }

        return deck;
    }

    shuffle(): void {
        this.cards = shuffle(this.cards);
    }

    drawCard(): Card | undefined {
        return this.cards.pop();
    }

    resetDeck(): void {
        this.cards = this.createDeck();
        this.shuffle();
    }
}

export default Deck;