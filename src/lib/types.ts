type User = {
  id: string;
};

type Vote = {
  userId: string;
  tier: string;
};

type TierItem = {
  id: string;
  imageURL?: string;
  votes: Vote[];
  tier?: string;
};

export type TierList = {
  id: string;
  title: string;
  tiers: string[];
  items: TierItem[];
  currentVoteItemId?: string;
  users: User[];
  createdAt: Date;
  modifiedAt: Date;
  createdBy: string;
};
