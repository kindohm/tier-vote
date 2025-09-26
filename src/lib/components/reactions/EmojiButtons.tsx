"use client";

import React from 'react';
import type { EmojiType } from './types';
import { EMOJI_MAP } from './types';

interface EmojiButtonsProps {
  onReaction: (emoji: EmojiType) => void;
  disabled?: boolean;
}

export function EmojiButtons({ onReaction, disabled = false }: EmojiButtonsProps) {
  return (
    <div className="d-flex gap-3 justify-content-center mt-3">
      <button
        type="button"
        className="btn btn-outline-light btn-lg rounded-circle p-3"
        onClick={() => onReaction('party')}
        disabled={disabled}
        style={{
          width: '60px',
          height: '60px',
          fontSize: '1.5rem',
          border: '2px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Great round! 🎉"
      >
        {EMOJI_MAP.party}
      </button>
      
      <button
        type="button"
        className="btn btn-outline-light btn-lg rounded-circle p-3"
        onClick={() => onReaction('poo')}
        disabled={disabled}
        style={{
          width: '60px',
          height: '60px',
          fontSize: '1.5rem',
          border: '2px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Bad choice! 💩"
      >
        {EMOJI_MAP.poo}
      </button>
    </div>
  );
}