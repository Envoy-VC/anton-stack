# 1Inch Plugin

Get balances for different tokens for a wallet using the 1inch API.

## Installation
```bash
npm install @anton-stack/1inch-plugin
```

## Usage for AgentKit

```ts
import { AgentKit } from '@coinbase/agentkit';
import { oneInchActionProvider } from '@anton-stack/1inch-plugin/agentkit';

const oneInch = oneInchActionProvider({ apiKey: 'YOUR_API_KEY' });

const agentKit = await AgentKit.from({
    walletProvider, // Your Wallet Provider. eg- viem, cdp, etc.
    actionProviders: [oneInch],
});
```

## Tools

- **Get Balances**: Get the balances of a wallet address on a specific chain