import Color from "../enum/Color";

export type PlayerType = {
    id: number;
    hand: CardType[];
};

export type CardType = {
    color: Color;
    value: number;
};