export interface BucketConfig {
  id: string;
  userId: string;
  allowance: number;
  spendPct: number;
  savePct: number;
  givePct: number;
  spendBalance: number;
  saveBalance: number;
  giveBalance: number;
  saveGoalName: string;
  saveGoalPrice: number;
  giveGoalName: string;
  giveGoalPrice: number;
}

export enum BucketTransactionType {
  INCOME = 'INCOME',
  USE_SPEND = 'USE_SPEND',
  USE_GIVE = 'USE_GIVE',
}

export interface BucketTransaction {
  id: string;
  userId: string;
  type: BucketTransactionType;
  amount: number;
  spendDelta: number;
  saveDelta: number;
  giveDelta: number;
  note: string;
  createdAt: string;
}

export interface BucketsState {
  config: BucketConfig | null;
  transactions: BucketTransaction[];
}
