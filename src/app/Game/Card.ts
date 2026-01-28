import Color from "../enum/Color";

type CardType = 'NUMBER' | 'SKIP' | 'REVERSE' | 'DRAW_TWO' | 'WILD' | 'WILD_DRAW_FOUR';

class Card {
    m_cardOwnerId: number;
    m_color: Color;
    m_value: number;
    m_cardType: CardType;

    constructor(cardOwnerId: number, color: Color, value: number, cardType: CardType = 'NUMBER') {
        this.m_cardOwnerId = cardOwnerId;
        this.m_color = color;
        this.m_value = value;
        this.m_cardType = cardType;
    }

    playCard() {
        // Logic to play the card
    }
}

export default Card;