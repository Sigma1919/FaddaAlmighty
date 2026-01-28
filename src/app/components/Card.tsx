'use client';

import { Color } from '../enum/Color';

interface CardProps {
  color: Color;
  value: number;
  cardType?: 'NUMBER' | 'SKIP' | 'REVERSE' | 'DRAW_TWO' | 'WILD' | 'WILD_DRAW_FOUR';
  onClick?: () => void;
  isSelected?: boolean;
}

export default function CardComponent({ color, value, cardType = 'NUMBER', onClick, isSelected }: CardProps) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    'RED': { bg: 'bg-red-600', text: 'text-white' },
    'GREEN': { bg: 'bg-green-600', text: 'text-white' },
    'BLUE': { bg: 'bg-blue-600', text: 'text-white' },
    'YELLOW': { bg: 'bg-yellow-500', text: 'text-gray-900' },
  };

  const { bg, text } = colorMap[color as string] || { bg: 'bg-gray-500', text: 'text-white' };

  const getEmoji = (type: string, val: number) => {
    const numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    
    const specialCards: Record<string, string> = {
      'SKIP': '⏭️',
      'REVERSE': '🔄',
      'DRAW_TWO': '➕2️⃣',
      'WILD': '😛',
      'WILD_DRAW_FOUR': '😛😛😛😛',
    };

    if (type === 'NUMBER') {
      // Make sure val is a number and within bounds
      const numVal = Number(val);
      if (numVal >= 0 && numVal <= 9) {
        return numberEmojis[numVal];
      }
      return numberEmojis[0]; // Default to 0️⃣
    }
    return specialCards[type] || '🃏';
  };

  const getDisplayText = (type: string) => {
    const specialCardNames: Record<string, string> = {
      'SKIP': 'SKIP',
      'REVERSE': 'REV',
      'DRAW_TWO': '+2',
      'WILD': 'WILD',
      'WILD_DRAW_FOUR': '+4',
    };
    return specialCardNames[type] || '';
  };

  const emoji = getEmoji(cardType, value);
  const displayText = getDisplayText(cardType);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-24 h-32 rounded-xl font-bold text-2xl cursor-pointer
        transition transform hover:scale-110 active:scale-95
        ${bg} ${text}
        ${isSelected ? 'ring-4 ring-white scale-110' : 'hover:shadow-xl'}
        shadow-lg border-2 border-white/20
        flex flex-col items-center justify-center gap-1
      `}
    >
      <div className="text-3xl">{emoji}</div>
      <div className="text-xs font-bold">{cardType === 'NUMBER' ? value : displayText}</div>
    </button>
  );
}
