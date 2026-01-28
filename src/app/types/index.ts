import Color from "../enum/Color";

export type CardType = 'NUMBER' | 'SKIP' | 'REVERSE' | 'DRAW_TWO' | 'WILD' | 'WILD_DRAW_FOUR';

export type CardDataType = {
    color: Color;
    value: number;
    cardType?: CardType;
};

export type PlayerType = {
    id: number;
    hand: CardDataType[];
};