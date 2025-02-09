# Uniswap Plugin

Uniswap plugin allows you to check approval, get quote and swap tokens on Uniswap.

You can get your Uniswap API key [here](https://hub.uniswap.org/).

For testing purposes, you can use the following base URL and API key:

```
https://trade-api.gateway.uniswap.org/v1
kHEhfIPvCE3PO5PeT0rNb1CA3JJcnQ8r7kJDXN5X
```

## Installation
```bash
npm install @anton-stack/uniswap-plugin
```

## Usage for AgentKit

```ts
import { AgentKit } from '@coinbase/agentkit';
import { uniswapActionProvider } from '@anton-stack/uniswap-plugin/agentkit';

const uniswap = uniswapActionProvider({ apiKey: 'YOUR_API_KEY', baseUrl: 'YOUR_BASE_URL' });

const agentKit = await AgentKit.from({
    walletProvider, // Your Wallet Provider. eg- viem, cdp, etc.
    actionProviders: [uniswap],
});
```

## Tools

- **Check Approval**: Check if the wallet has enough approval for a token and return the transaction to approve the token.
- **Get Quote**: Get the quote for a swap.
- **Swap Tokens**: Swap tokens on Uniswap.