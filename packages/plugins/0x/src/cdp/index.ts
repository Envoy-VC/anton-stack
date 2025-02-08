import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import type { z } from 'zod';

import {
  GetQuoteParameters,
  GiveAllowanceForSwapContractAddress,
  supportedChains,
} from '~/common';

export class ZeroXActionProvider extends ActionProvider<EvmWalletProvider> {
  private readonly apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    super('0x', []);
    this.apiKey = apiKey;
  }

  private async makeRequest(queryParams: Record<string, string | undefined>) {
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, v]) => v !== undefined)
    ) as Record<string, string>;

    const url = new URL(
      `https://api.0x.org/swap/allowance-holder/quote?${new URLSearchParams(filteredParams).toString()}`
    );

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        '0x-api-key': this.apiKey,
        '0x-version': 'v2',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${JSON.stringify(await response.text(), null, 2)}`
      );
    }

    return response.json();
  }

  @CreateAction({
    name: '0x_getQuote',
    description: 'Get a quote for a swap from 0x',
    schema: GetQuoteParameters,
  })
  async getQuote(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetQuoteParameters>
  ) {
    const queryParams = {
      chainId: walletProvider.getNetwork().chainId?.toString(),
      sellToken: parameters.sellToken,
      buyToken: parameters.buyToken,
      sellAmount: parameters.sellAmount,
      taker: walletProvider.getAddress(),
      txOrigin: walletProvider.getAddress(),
      slippageBps: parameters.slippageBps?.toString(),
    };

    return await this.makeRequest(queryParams);
  }

  @CreateAction({
    name: '0x_swap',
    description: 'Swap tokens on 0x',
    schema: GetQuoteParameters,
  })
  async swap(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetQuoteParameters>
  ): Promise<string> {
    const quote = await this.getQuote(walletProvider, parameters);
    const transaction = quote.transaction;

    const hash = await walletProvider.sendTransaction({
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
    });

    return hash;
  }

  @CreateAction({
    name: '0x_get_contract_address_to_give_allowance_for_swap',
    description: 'Get the contract address to give allowance for a swap',
    schema: GetQuoteParameters,
  })
  getContractAddressToGiveAllowanceForSwap(
    _walletProvider: EvmWalletProvider,
    _parameters: z.infer<typeof GetQuoteParameters>
  ) {
    return GiveAllowanceForSwapContractAddress;
  }

  supportsNetwork(network: Network): boolean {
    if (!network.chainId) {
      return false;
    }
    return supportedChains.includes(network.chainId);
  }
}
