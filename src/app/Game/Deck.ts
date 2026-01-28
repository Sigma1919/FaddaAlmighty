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

        // Add number cards (0-9) for each color
        for (const color of colors) {
            for (let value = 0; value <= 9; value++) {
                deck.push(new Card(0, color, value, 'NUMBER'));
            }
            // Add one extra of each for colors (1-9)
            for (let value = 1; value <= 9; value++) {
                deck.push(new Card(0, color, value, 'NUMBER'));
            }
        }

        // Add special cards (2x of each per color)
        for (const color of colors) {
            deck.push(new Card(0, color, 0, 'SKIP'), new Card(0, color, 0, 'SKIP'));
            deck.push(new Card(0, color, 0, 'REVERSE'), new Card(0, color, 0, 'REVERSE'));
            deck.push(new Card(0, color, 0, 'DRAW_TWO'), new Card(0, color, 0, 'DRAW_TWO'));
        }

        // Add Wild cards (4x each)
        for (let i = 0; i < 4; i++) {
            deck.push(new Card(0, Color.RED, 0, 'WILD'));
            deck.push(new Card(0, Color.RED, 0, 'WILD_DRAW_FOUR'));
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