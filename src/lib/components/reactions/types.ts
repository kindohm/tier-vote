export type EmojiType = 'party' | 'poo';

export type Reaction = {
  id: string;
  userId: string;
  userName?: string;
  emoji: EmojiType;
  createdAt: number;
  roundNumber?: number;
};

export type ReactionDoc = {
  id: string;
  userId: string;
  userName?: string;
  emoji: EmojiType;
  createdAt: { toMillis?: () => number } | number;
  roundNumber?: number;
};

export const EMOJI_MAP = {
  party: '🎉',
  poo: '💩',
} as const;