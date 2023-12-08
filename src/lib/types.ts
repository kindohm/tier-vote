type User = {
  id: string;
  name: string;
};

export type Vote = {
  userId: string;
  tier: string;
};

export type TierItem = {
  id: string;
  imageURL?: string;
  votes: Vote[];
  tier?: string;
  modifiedAt: Date;
};

export type TierList = {
  id: string;
  title: string;
  tiers: string[];
  items: TierItem[];
  currentVoteItemId?: string | null;
  lastVoteItemId?: string | null;
  users: User[];
  createdAt: Date;
  modifiedAt: Date;
  createdBy: string;
  closed: boolean;
  inProgress: boolean;
  itemVotingEndsAt?: Date | null;
};
