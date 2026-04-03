import type { BucketsState, BucketConfig, BucketTransaction } from '@rowad/shared';
import type { BucketSetupInput, BucketIncomeInput, BucketUseInput } from '@rowad/shared';
import apiClient from './client';

export async function getBuckets(): Promise<BucketsState> {
  const res = await apiClient.get<BucketsState>('/buckets');
  return res.data;
}

export async function setupBuckets(data: BucketSetupInput): Promise<BucketConfig> {
  const res = await apiClient.post<BucketConfig>('/buckets/setup', data);
  return res.data;
}

export async function addIncome(data: BucketIncomeInput): Promise<BucketTransaction> {
  const res = await apiClient.post<BucketTransaction>('/buckets/income', data);
  return res.data;
}

export async function useBucket(data: BucketUseInput): Promise<BucketTransaction> {
  const res = await apiClient.post<BucketTransaction>('/buckets/use', data);
  return res.data;
}

export async function resetBuckets(): Promise<void> {
  await apiClient.delete('/buckets');
}
