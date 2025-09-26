"use client";

import React, { useMemo } from 'react';
import type { EmojiType } from './types';
import { EMOJI_MAP, ALL_EMOJI_TYPES } from './types';

interface EmojiButtonsProps {
  onReaction: (emoji: EmojiType) => void;
  disabled?: boolean;
}

// Function to get 3 random emojis from the list
function getRandomEmojis(): EmojiType[] {
  const shuffled = [...ALL_EMOJI_TYPES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export function EmojiButtons({ onReaction, disabled = false }: EmojiButtonsProps) {
  // Get 3 random emojis for this render - will be consistent until component unmounts
  const randomEmojis = useMemo(() => getRandomEmojis(), []);

  const buttonStyle = {
    width: '60px',
    height: '60px',
    fontSize: '1.5rem',
    border: '2px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
      e.currentTarget.style.transform = 'scale(1.1)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div className="d-flex gap-3 justify-content-center mt-3">
      {randomEmojis.map((emojiType) => (
        <button
          key={emojiType}
          type="button"
          className="btn btn-outline-light btn-lg rounded-circle p-3"
          onClick={() => onReaction(emojiType)}
          disabled={disabled}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          title={`React with ${EMOJI_MAP[emojiType]}`}
        >
          {EMOJI_MAP[emojiType]}
        </button>
      ))}
    </div>
  );
}