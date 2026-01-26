import Card from "../Game/Card";



class Player {
    private m_playerId: number;
    private m_hand: Card[];

    constructor(playerId: number) {
        this.m_playerId = playerId;
        this.m_hand = [];
    }

    drawCard(card: Card): void {
        this.m_hand.push(card);
    }

    playCard(cardIndex: number): Card | null {
        if (cardIndex >= 0 && cardIndex < this.m_hand.length) {
            const card = this.m_hand.splice(cardIndex, 1)[0];
            return card || null;
        }
        return null;
    }

    getHand(): Card[] {
        return this.m_hand;
    }

    getPlayerId(): number {
        return this.m_playerId;
    }
}

export default Player;