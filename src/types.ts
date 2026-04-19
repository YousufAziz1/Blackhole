export type QuestType = 'follow_x' | 'hold_tokens' | 'share_post' | 'join_telegram' | 'create_content';

export type CampaignTaskType = 'follow' | 'like' | 'retweet' | 'comment' | 'custom';

export interface CampaignTask {
  id: string;
  type: CampaignTaskType;
  link: string;
  instructions: string;
}

/** @deprecated use campaignTasks[] instead */
export interface MultiTaskConfig {
  follow: boolean;
  like: boolean;
  retweet: boolean;
  comment: boolean;
  postUrl?: string;
  followUsername?: string;
  commentText?: string;
}

export interface Quest {
  id: string;
  creatorWallet: string;
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
  projectLink?: string;
  questType: QuestType;
  title: string;
  description: string;
  mode?: 'single' | 'multi';
  tasks?: MultiTaskConfig; // legacy — kept for backward compat
  campaignTasks?: CampaignTask[]; // Galxe-style dynamic task list
  rewardAmount: number;
  maxCompletions: number;
  currentCompletions: number;
  deadline: string; // ISO date string
  proofInstructions: string;
  createdAt: string; // ISO date string
  requirements?: Record<string, any>; // Dynamic fields based on questType
  isActive: boolean;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: string;
  questId: string;
  fanWallet: string;
  proofData: string;
  submittedAt: string; // ISO date string
  status: SubmissionStatus;
  rewardSent: boolean;
}

export interface QuestIdea {
  questType: QuestType;
  title: string;
  description: string;
  suggestedReward: number;
  maxCompletions: number;
  whyItWorks: string;
}
