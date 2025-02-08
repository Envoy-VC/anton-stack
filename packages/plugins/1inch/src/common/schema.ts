import { z } from 'zod';

export const GetBalancesParameters = z.object({
  walletAddress: z
    .string()
    .optional()
    .describe('The wallet address to check balances for'),
});
