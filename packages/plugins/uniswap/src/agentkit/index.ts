import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import type { z } from 'zod';
import {
  CheckApprovalBodySchema,
  GetQuoteParameters,
  SUPPORTED_CHAINS,
  type UniswapCtorParams,
} from '~/common';

class UniswapActionProvider extends ActionProvider<EvmWalletProvider> {
  private readonly params: UniswapCtorParams;

  constructor(params: UniswapCtorParams) {
    super('temp', []);
    this.params = params;
  }

  private async makeRequest(endpoint: string, parameters: unknown) {
    const url = new URL(`${this.params.baseUrl}/${endpoint}`);

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify(parameters),
      headers: {
        'x-api-key': this.params.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${endpoint}: ${JSON.stringify(await response.json(), null, 2)}`
      );
    }

    return response.json();
  }

  @CreateAction({
    name: 'uniswap_check_approval',
    description:
      'Check if the wallet has enough approval for a token and return the transaction to approve the token. The approval must takes place before the swap transaction',
    schema: CheckApprovalBodySchema,
  })
  async checkApproval(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof CheckApprovalBodySchema>
  ) {
    const data = await this.makeRequest('check_approval', {
      token: parameters.token,
      amount: parameters.amount,
      walletAddress: parameters.walletAddress,
      chainId: walletProvider.getNetwork().chainId,
    });

    const approval = data.approval;

    if (!approval) {
      return {
        status: 'approved',
      };
    }

    const hash = await walletProvider.sendTransaction({
      to: approval.to,
      value: approval.value,
      data: approval.data,
    });

    return {
      status: 'approved',
      txHash: hash,
    };
  }

  @CreateAction({
    name: 'uniswap_get_quote',
    description: 'Get the quote for a swap',
    schema: GetQuoteParameters,
  })
  async getQuote(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetQuoteParameters>
  ) {
    return await this.makeRequest('quote', {
      ...parameters,
      tokenInChainId: walletProvider.getNetwork().chainId,
      tokenOutChainId:
        parameters.tokenOutChainId ?? walletProvider.getNetwork().chainId,
      swapper: walletProvider.getAddress(),
    });
  }

  @CreateAction({
    name: 'uniswap_swap_tokens',
    description: 'Swap tokens on Uniswap',
    schema: GetQuoteParameters,
  })
  async getSwapTransaction(
    walletProvider: EvmWalletProvider,
    parameters: z.infer<typeof GetQuoteParameters>
  ) {
    const quote = await this.getQuote(walletProvider, parameters);

    const response = await this.makeRequest('swap', {
      quote: quote.quote,
    });

    const swap = response.swap;

    const hash = await walletProvider.sendTransaction({
      to: swap.to,
      value: swap.value,
      data: swap.data,
    });

    return {
      txHash: hash,
    };
  }

  supportsNetwork(network: Network): boolean {
    return (
      network.protocolFamily === 'evm' &&
      SUPPORTED_CHAINS.some((c) => c === network.chainId)
    );
  }
}

export const uniswapActionProvider = (params: UniswapCtorParams) =>
  new UniswapActionProvider(params);
