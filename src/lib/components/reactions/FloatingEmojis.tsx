"use client";

import React, { useEffect, useState, useRef } from 'react';
import type { Reaction } from './types';
import { EMOJI_MAP } from './types';

type AnimatingEmoji = {
  id: string;
  emoji: string;
  startTime: number;
  x: number; // Starting X position (0-100%)
};

const ANIMATION_DURATION = 3000; // 3 seconds for fade out

// CSS keyframes for smooth animation
const emojiAnimationStyles = `
  @keyframes floatUpAndFade {
    0% {
      transform: translateY(0) translateX(-50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-120vh) translateX(-50%) scale(1.3);
      opacity: 0;
    }
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleId = 'floating-emoji-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = emojiAnimationStyles;
    document.head.appendChild(style);
  }
}

export function FloatingEmojis({ reactions }: { reactions: Reaction[] }) {
  const [animatingEmojis, setAnimatingEmojis] = useState<AnimatingEmoji[]>([]);
  const lastReactionCount = useRef(0);
  const animationCounter = useRef(0);

  useEffect(() => {
    // Simple approach: only trigger when reactions array grows
    if (reactions.length > lastReactionCount.current) {
      const newReactionCount = reactions.length - lastReactionCount.current;
      const newReactions = reactions.slice(-newReactionCount); // Get the newest reactions
      
      // Create animations for new reactions
      const newEmojis: AnimatingEmoji[] = newReactions.map(reaction => ({
        id: `${reaction.id}-${animationCounter.current++}`, // Unique key for each animation
        emoji: EMOJI_MAP[reaction.emoji],
        startTime: Date.now(),
        x: Math.random() * 80 + 10, // Random X position between 10% and 90%
      }));
      
      setAnimatingEmojis(prev => [...prev, ...newEmojis]);
      lastReactionCount.current = reactions.length;
    } else if (reactions.length < lastReactionCount.current) {
      // Reactions array got smaller (cleanup happened), reset our counter
      lastReactionCount.current = reactions.length;
    }
  }, [reactions]);

  useEffect(() => {
    // Clean up finished animations
    const interval = setInterval(() => {
      const now = Date.now();
      setAnimatingEmojis(prev => 
        prev.filter(emoji => now - emoji.startTime < ANIMATION_DURATION)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Don't render anything if there are no animating emojis
  if (animatingEmojis.length === 0) {
    return null;
  }

  return (
    <div 
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{ 
        zIndex: 1100, 
        overflow: 'hidden', 
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {animatingEmojis.map((emoji) => {
        return (
          <div
            key={emoji.id}
            className="position-absolute"
            style={{
              left: `${emoji.x}%`,
              bottom: '10%',
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
              animation: `floatUpAndFade ${ANIMATION_DURATION}ms linear forwards`,
            }}
          >
            {emoji.emoji}
          </div>
        );
      })}
    </div>
  );
}