import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import type { z } from 'zod';

import { encodeFunctionData } from 'viem';
import { CFA_FORWARDER_ABI, POOL_ABI } from '../common/constants';
import {
  FlowParameters,
  GetFlowrateParameters,
  GetMemberFlowRateParameters,
  GetTotalFlowRateParameters,
  GetUnitsParameters,
  UpdateMemberUnitsParameters,
} from '../common/schema';

class SuperfluidActionProvider extends ActionProvider<EvmWalletProvider> {
  private readonly CFA_FORWARDER_ADDRESS =
    '0xcfA132E353cB4E398080B9700609bb008eceB125';

  constructor() {
    super('superfluid', []);
  }

  @CreateAction({
    name: 'create_or_update_or_delete_flow',
    description:
      'Create, update, or delete a flow of tokens from sender to receiver',
    schema: FlowParameters,
  })
  async flow(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof FlowParameters>
  ) {
    try {
      const data = encodeFunctionData({
        abi: CFA_FORWARDER_ABI,
        functionName: 'setFlowrate',
        args: [
          parameters.token as `0x${string}`,
          parameters.receiver as `0x${string}`,
          BigInt(parameters.flowrate),
        ],
      });

      const hash = await walletProvider.sendTransaction({
        to: this.CFA_FORWARDER_ADDRESS,
        data,
      });

      return hash;
    } catch (error) {
      throw new Error(`Failed to set flow: ${error}`);
    }
  }

  @CreateAction({
    name: 'get_flow_rate',
    description:
      'Get the current flowrate between a sender and receiver for a specific token',
    schema: GetFlowrateParameters,
  })
  async getFlowrate(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetFlowrateParameters>
  ) {
    const result = await walletProvider.readContract({
      address: this.CFA_FORWARDER_ADDRESS,
      abi: CFA_FORWARDER_ABI,
      functionName: 'getFlowrate',
      args: [parameters.token, parameters.sender, parameters.receiver],
    });

    return BigInt(result as string);
  }

  @CreateAction({
    name: 'update_member_units',
    description: 'Update the units for a member in a Superfluid Pool',
    schema: UpdateMemberUnitsParameters,
  })
  async updateMemberUnits(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof UpdateMemberUnitsParameters>
  ) {
    try {
      const data = encodeFunctionData({
        abi: POOL_ABI,
        functionName: 'updateMemberUnits',
        args: [
          parameters.memberAddr as `0x${string}`,
          BigInt(parameters.newUnits),
        ],
      });
      const hash = await walletProvider.sendTransaction({
        to: parameters.poolAddress as `0x${string}`,
        data,
      });
      return hash;
    } catch (error) {
      throw new Error(`Failed to update member units: ${error}`);
    }
  }

  @CreateAction({
    name: 'get_member_units',
    description: 'Get the units of a member in a Superfluid Pool',
    schema: GetUnitsParameters,
  })
  async getUnits(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetUnitsParameters>
  ) {
    const result = await walletProvider.readContract({
      address: parameters.poolAddress as `0x${string}`,
      abi: POOL_ABI,
      functionName: 'getUnits',
      args: [parameters.memberAddr],
    });
    return BigInt(result as string);
  }

  @CreateAction({
    name: 'get_member_flow_rate',
    description: 'Get the flow rate of a member in a Superfluid Pool',
    schema: GetMemberFlowRateParameters,
  })
  async getMemberFlowRate(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetMemberFlowRateParameters>
  ) {
    const result = await walletProvider.readContract({
      address: parameters.poolAddress as `0x${string}`,
      abi: POOL_ABI,
      functionName: 'getMemberFlowRate',
      args: [parameters.memberAddr],
    });
    return result as number;
  }

  @CreateAction({
    name: 'get_total_flow_rate',
    description: 'Get the total flow rate of a Superfluid Pool',
    schema: GetTotalFlowRateParameters,
  })
  async getTotalFlowRate(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetTotalFlowRateParameters>
  ) {
    const result = await walletProvider.readContract({
      address: parameters.poolAddress as `0x${string}`,
      abi: POOL_ABI,
      functionName: 'getTotalFlowRate',
      args: [],
    });
    return result as number;
  }

  supportsNetwork = (_network: Network): boolean => true;
}

export const superFluidActionProvider = () => new SuperfluidActionProvider();
