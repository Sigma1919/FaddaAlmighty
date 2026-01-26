import Color from "../enum/Color";

class Card {
    m_cardOwnerId: number;
    m_color: Color;
    m_value: number;

    constructor(cardOwnerId: number, color: Color, value: number) {
        this.m_cardOwnerId = cardOwnerId;
        this.m_color = color;
        this.m_value = value;
    }

    playCard() {
        // Logic to play the card
    }
}

export default Card;