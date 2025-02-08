import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import type { z } from 'zod';

import {
  type AggregatedBalancesAndAllowancesResponse,
  type BalanceServiceParams,
  GetBalancesParameters,
} from '~/common';

export class OneInchActionProvider extends ActionProvider<EvmWalletProvider> {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  constructor(params: BalanceServiceParams) {
    super('1inch', []);
    this.baseUrl = params.baseUrl ?? 'https://api.1inch.dev';
    this.apiKey = params.apiKey;
  }

  @CreateAction({
    name: '1inch.get_balances',
    description: 'Get the balances of a wallet address on a specific chain',
    schema: GetBalancesParameters,
  })
  async getQuote(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetBalancesParameters>
  ): Promise<AggregatedBalancesAndAllowancesResponse> {
    const { walletAddress } = parameters;
    const chainId = walletProvider.getNetwork().chainId;

    const url = new URL(
      `${this.baseUrl}/balance/v1.2/${chainId}/balances/${walletAddress ?? walletProvider.getAddress()}`
    );

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch balances: ${response.statusText}`);
    }

    return await response.json();
  }

  supportsNetwork(network: Network): boolean {
    return network.protocolFamily === 'evm';
  }
}
