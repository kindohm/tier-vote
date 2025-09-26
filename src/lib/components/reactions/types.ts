export type EmojiType = 'party' | 'poo' | 'sunglasses' | 'sobbing' | 'rofl';

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
  sunglasses: '😎',
  sobbing: '😭',
  rofl: '🤣',
} as const;

export const ALL_EMOJI_TYPES: EmojiType[] = ['party', 'poo', 'sunglasses', 'sobbing', 'rofl'];