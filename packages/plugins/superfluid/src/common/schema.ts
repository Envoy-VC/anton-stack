import { z } from 'zod';

export const FlowParameters = z.object({
  token: z
    .string()
    .describe('The address of the Super Token to get the flow of'),
  receiver: z.string().describe('The address of the receiver of the flow'),
  flowrate: z.string().describe('The flowrate of the flow'),
});

export const GetFlowrateParameters = z.object({
  token: z
    .string()
    .describe('The address of the Super Token to get the flow of'),
  sender: z.string().describe('The address of the sender of the flow'),
  receiver: z.string().describe('The address of the receiver of the flow'),
});

export const UpdateMemberUnitsParameters = z.object({
  poolAddress: z.string().describe('The address of the Pool contract'),
  memberAddr: z
    .string()
    .describe('The address of the member to update units for'),
  newUnits: z.number().describe('The new units amount for the member'),
});

export const GetUnitsParameters = z.object({
  poolAddress: z.string().describe('The address of the Pool contract'),
  memberAddr: z.string().describe('The address of the member to get units for'),
});

export const GetMemberFlowRateParameters = z.object({
  poolAddress: z.string().describe('The address of the Pool contract'),
  memberAddr: z
    .string()
    .describe('The address of the member to get flow rate for'),
});

export const GetTotalFlowRateParameters = z.object({
  poolAddress: z.string().describe('The address of the Pool contract'),
});

export const DeploySuperTokenWrapperParameters = z.object({
  underlyingToken: z
    .string()
    .describe(
      'The address of the contract to deploy the Super Token Wrapper for'
    ),
  underlyingDecimals: z
    .number()
    .describe('The decimals of the underlying token'),
  upgradability: z
    .enum(['0', '1', '2'])
    .describe('The upgradability of the Super Token Wrapper'),
  name: z.string().describe('The name of the Super Token Wrapper'),
  symbol: z.string().describe('The symbol of the Super Token Wrapper'),
});
