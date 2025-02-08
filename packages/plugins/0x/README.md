# 0x Plugin

Gets Quotes for Swaps using the 0x API.

## Installation
```bash
npm install @anton-stack/0x-plugin
```

## Usage for AgentKit

```ts
import { AgentKit } from '@coinbase/agentkit';
import { zeroXActionProvider } from '@anton-stack/0x-plugin/agentkit';

const zeroX = zeroXActionProvider({ apiKey: 'YOUR_API_KEY' });

const agentKit = await AgentKit.from({
    walletProvider, // Your Wallet Provider. eg- viem, cdp, etc.
    actionProviders: [zeroX],
});
```

## Tools

- **Get Quote**: Get a quote for a swap from 0x
- **Swap**: Swap tokens on 0x