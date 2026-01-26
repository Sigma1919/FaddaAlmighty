import Deck from "../Game/Deck";
import Player from "../Game/Player";

class Game {
    private players: Player[];
    private deck: Deck;
    private currentPlayerIndex: number;
    private gameActive: boolean;

    constructor(playerCount: number) {
        this.players = this.createPlayers(playerCount);
        this.deck = new Deck();
        this.currentPlayerIndex = 0;
        this.gameActive = false;
    }

    private createPlayers(playerCount: number): Player[] {
        const players: Player[] = [];
        for (let i = 0; i < playerCount; i++) {
            players.push(new Player(i));
        }
        return players;
    }

    public startGame(): void {
        this.deck.shuffle();
        this.dealCards();
        this.gameActive = true;
        this.playTurn();
    }

    private dealCards(): void {
        for (let player of this.players) {
            for (let i = 0; i < 7; i++) {
                const card = this.deck.drawCard();
                if (card) {
                    player.drawCard(card);
                }
            }
        }
    }

    public playTurn(): void {
        if (!this.gameActive) return;

        const currentPlayer = this.players[this.currentPlayerIndex];
        // Logic for the current player to play their turn
        // ...

        this.checkWinCondition();
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    private checkWinCondition(): void {
        for (let player of this.players) {
            if (player.getHand().length === 0) {
                this.gameActive = false;
                console.log(`Player ${player.getPlayerId()} has won the game!`);
                return;
            }
        }
    }
}

export default Game;