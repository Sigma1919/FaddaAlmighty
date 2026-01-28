'use client';

import { useState, useEffect } from 'react';
import Game from '../Game/Game';
import PlayerHand from './PlayerHand';
import CardComponent from './Card';
import { Color } from '../enum/Color';

export default function GameBoard() {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [topDiscardCard, setTopDiscardCard] = useState<any>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<any>(null);

  useEffect(() => {
    if (game) {
      updateGameState();
    }
  }, [game]);

  const updateGameState = () => {
    if (game) {
      const state = {
        players: game['players'],
        currentPlayerIndex: game['currentPlayerIndex'],
        gameActive: game['gameActive'],
      };
      setGameState(state);
      setCurrentPlayerIndex(game['currentPlayerIndex']);
      setGameActive(game['gameActive']);
    }
  };

  const startNewGame = () => {
    const newGame = new Game(playerCount);
    setGame(newGame);
    newGame.startGame();
    updateGameState();
  };

  const canPlayCard = (card: any): boolean => {
    // Wild cards can always be played
    if (card.m_cardType === 'WILD' || card.m_cardType === 'WILD_DRAW_FOUR') {
      return true;
    }

    // If no discard card yet, any card can be played
    if (!topDiscardCard) {
      return true;
    }

    // Check if same color
    if ((card.m_color || card.color) === (topDiscardCard.m_color || topDiscardCard.color)) {
      return true;
    }

    // Check if same number (only for number cards)
    if ((card.m_cardType || card.cardType || 'NUMBER') === 'NUMBER') {
      if ((card.m_value || card.value) === (topDiscardCard.m_value || topDiscardCard.value)) {
        return true;
      }
    } else if ((topDiscardCard.m_cardType || topDiscardCard.cardType || 'NUMBER') !== 'NUMBER') {
      // Special cards can match other special cards of same type
      if ((card.m_cardType || card.cardType) === (topDiscardCard.m_cardType || topDiscardCard.cardType)) {
        return true;
      }
    }

    return false;
  };

  const handlePlayCard = (cardIndex: number) => {
    if (game && gameActive) {
      const currentPlayer = game['players']?.[currentPlayerIndex];
      if (currentPlayer) {
        const playerHand = currentPlayer.getHand?.();
        const cardToPlay = playerHand?.[cardIndex];

        // Check if card can be played
        if (!canPlayCard(cardToPlay)) {
          alert('Invalid move! Card color or number must match the top discard card.');
          return;
        }

        const playedCard = currentPlayer.playCard(cardIndex);
        // Track the played card as the top discard card
        if (playedCard) {
          // If it's a WILD card, show color picker
          if (playedCard.m_cardType === 'WILD' || playedCard.m_cardType === 'WILD_DRAW_FOUR') {
            setPendingWildCard(playedCard);
            setShowColorPicker(true);
            return; // Don't advance turn yet
          }
          setTopDiscardCard(playedCard);
        }

        let nextIndex = (currentPlayerIndex + 1) % playerCount;
        
        // Handle DRAW_TWO
        if (playedCard && game && playedCard.m_cardType === 'DRAW_TWO') {
          const nextPlayer = game['players']?.[nextIndex];
          
          if (nextPlayer) {
            for (let i = 0; i < 2; i++) {
              const drawnCard = game['deck'].drawCard();
              if (drawnCard) {
                nextPlayer.drawCard(drawnCard);
              }
            }
          }
          
          // Skip the next player's turn
          nextIndex = (nextIndex + 1) % playerCount;
        }

        // Update the game object's internal state
        if (game) {
          game['currentPlayerIndex'] = nextIndex;
        }
        setCurrentPlayerIndex(nextIndex);
        updateGameState();
      }
    }
  };

  const handleColorSelection = (color: Color) => {
    if (!game) return;
    
    if (pendingWildCard) {
      // Update the wild card's color
      pendingWildCard.m_color = color;
      setTopDiscardCard(pendingWildCard);
    }
    setShowColorPicker(false);

    let nextIndex = (currentPlayerIndex + 1) % playerCount;

    // Handle WILD_DRAW_FOUR
    if (pendingWildCard && pendingWildCard.m_cardType === 'WILD_DRAW_FOUR') {
      const nextPlayer = game['players']?.[nextIndex];
      
      if (nextPlayer) {
        for (let i = 0; i < 4; i++) {
          const drawnCard = game['deck'].drawCard();
          if (drawnCard) {
            nextPlayer.drawCard(drawnCard);
          }
        }
      }
      
      // Skip the next player's turn
      nextIndex = (nextIndex + 1) % playerCount;
    }

    setPendingWildCard(null);
    game['currentPlayerIndex'] = nextIndex;
    setCurrentPlayerIndex(nextIndex);
    updateGameState();
  };

  const handleDrawCard = () => {
    if (game && gameActive) {
      const currentPlayer = game['players']?.[currentPlayerIndex];
      const card = game['deck'].drawCard();
      if (card && currentPlayer) {
        currentPlayer.drawCard(card);
        const nextIndex = (currentPlayerIndex + 1) % playerCount;
        setCurrentPlayerIndex(nextIndex);
        updateGameState();
      }
    }
  };

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="flex flex-col items-center justify-center min-h-screen gap-8">
          <h1 className="text-6xl font-extrabold text-center">UNO Game</h1>
          <div className="bg-gray-700/50 p-8 rounded-lg">
            <div className="mb-6">
              <label htmlFor="playerCount" className="text-xl font-semibold mb-3 block">Number of Players:</label>
              <input
                id="playerCount"
                name="playerCount"
                type="number"
                min="2"
                max="10"
                value={playerCount}
                onChange={(e) => setPlayerCount(Math.max(2, parseInt(e.target.value) || 2))}
                className="px-4 py-2 rounded bg-gray-600 text-white text-lg w-24"
              />
            </div>
            <button
              onClick={startNewGame}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-lg transition"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-8">UNO Game</h1>

        {/* Deck and Discard Pile */}
        <div className="flex justify-center gap-12 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-3">Draw Pile</h3>
            <div className="w-28 h-40 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold">🂠</span>
            </div>
            <button
              onClick={handleDrawCard}
              className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
            >
              Draw Card
            </button>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-3">Discard Pile</h3>
            {topDiscardCard ? (
              <CardComponent
                color={topDiscardCard.m_color || topDiscardCard.color}
                value={topDiscardCard.m_value !== undefined ? topDiscardCard.m_value : topDiscardCard.value}
                cardType={topDiscardCard.m_cardType || topDiscardCard.cardType || 'NUMBER'}
              />
            ) : (
              <div className="w-28 h-40 bg-yellow-400 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-2xl font-bold">📋</span>
              </div>
            )}
          </div>
        </div>

        {/* Players */}
        <div className="space-y-6">
          {gameState?.players && (
            <PlayerHand
              key={currentPlayerIndex}
              playerId={currentPlayerIndex}
              cards={gameState.players[currentPlayerIndex]?.getHand?.()}
              isCurrentPlayer={true}
              onCardClick={(cardIndex) => handlePlayCard(cardIndex)}
            />
          )}
        </div>

        {/* Game Over Check */}
        {gameState?.players?.some((p: any) => p.getHand?.().length === 0) && (
          <div className="mt-8 text-center">
            <div className="bg-green-500 p-6 rounded-lg inline-block">
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <button
                onClick={() => setGameActive(false)}
                className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}

        {/* Color Picker for WILD Cards */}
        {showColorPicker && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Choose a Color</h2>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => handleColorSelection(Color.RED)}
                  className="w-20 h-20 bg-red-600 rounded-lg hover:scale-110 transition font-bold text-white"
                >
                  RED
                </button>
                <button
                  onClick={() => handleColorSelection(Color.GREEN)}
                  className="w-20 h-20 bg-green-600 rounded-lg hover:scale-110 transition font-bold text-white"
                >
                  GREEN
                </button>
                <button
                  onClick={() => handleColorSelection(Color.BLUE)}
                  className="w-20 h-20 bg-blue-600 rounded-lg hover:scale-110 transition font-bold text-white"
                >
                  BLUE
                </button>
                <button
                  onClick={() => handleColorSelection(Color.YELLOW)}
                  className="w-20 h-20 bg-yellow-500 rounded-lg hover:scale-110 transition font-bold text-gray-900"
                >
                  YELLOW
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
