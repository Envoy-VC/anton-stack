import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import { z } from 'zod';

const tempSchema = z.string();

class TempActionProvider extends ActionProvider<EvmWalletProvider> {
  constructor() {
    super('temp', []);
  }

  @CreateAction({
    name: 'temp.action',
    description: 'placeholder',
    schema: tempSchema,
  })
  getQuote(
    _walletProvider: EvmWalletProvider,
    _parameters: z.infer<typeof tempSchema>
  ) {
    return 'placeholder';
  }

  supportsNetwork(network: Network): boolean {
    return network.protocolFamily === 'evm';
  }
}

export const tempActionProvider = () => new TempActionProvider();
