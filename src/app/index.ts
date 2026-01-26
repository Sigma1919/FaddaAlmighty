
import Game from './Game/Game';

const unoGame = new Game(2);

function main() {
    unoGame.startGame();
    unoGame.playTurn();
}

main();