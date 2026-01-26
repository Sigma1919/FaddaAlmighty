'use client';

import { Color } from '../enum/Color';
import CardComponent from './Card';

interface PlayerHandProps {
  playerId: number;
  cards: any[];
  isCurrentPlayer: boolean;
  onCardClick?: (cardIndex: number) => void;
}

export default function PlayerHand({
  playerId,
  cards,
  isCurrentPlayer,
  onCardClick,
}: PlayerHandProps) {
  return (
    <div className={`p-4 rounded-lg border-2 ${isCurrentPlayer ? 'border-yellow-400 bg-yellow-100/10' : 'border-gray-600 bg-gray-800/30'}`}>
      <h3 className="text-lg font-bold mb-3 text-white">
        Player {playerId + 1} {isCurrentPlayer && '(Current Turn)'} - {cards.length} cards
      </h3>
      <div className="flex flex-wrap gap-3">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <CardComponent
              key={index}
              color={card.m_color || card.color}
              value={card.m_value !== undefined ? card.m_value : card.value}
              onClick={() => onCardClick?.(index)}
            />
          ))
        ) : (
          <div className="text-green-400 font-bold text-lg">🎉 Winner!</div>
        )}
      </div>
    </div>
  );
}
