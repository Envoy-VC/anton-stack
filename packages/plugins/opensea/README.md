# Opensea Plugin

Opensea plugin allows you to interact with Opensea API.

## Installation
```bash
npm install @anton-stack/opensea-plugin
```

## Usage for AgentKit

```ts
import { AgentKit } from '@coinbase/agentkit';
import { openseaActionProvider } from '@anton-stack/opensea-plugin/agentkit';

const opensea = openseaActionProvider();

const agentKit = await AgentKit.from({
    walletProvider, // Your Wallet Provider. eg- viem, cdp, etc.
    actionProviders: [opensea],
});
```

## Tools

- **Get NFT Collection Statistics**: Get the statistics of an NFT collection.
- **Get NFT Sales**: Get the recent sales of an NFT collection.