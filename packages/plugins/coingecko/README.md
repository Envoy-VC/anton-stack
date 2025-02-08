# Coingecko Plugin

Coingecko plugin allows you to get data from Coingecko API.

## Installation
```bash
npm install @anton-stack/coingecko-plugin
```

## Usage for AgentKit

```ts
import { AgentKit } from '@coinbase/agentkit';
import { coingeckoActionProvider } from '@anton-stack/coingecko-plugin/agentkit';

const coingecko = coingeckoActionProvider({ apiKey: 'YOUR_API_KEY' });

const agentKit = await AgentKit.from({
    walletProvider, // Your Wallet Provider. eg- viem, cdp, etc.
    actionProviders: [coingecko],
});
```

## Tools

- **Get Coin Data**: Get detailed coin data by ID (including contract address, market data, community data, developer stats, and more).
- **Get Coin Prices**: Get the price of a specific coin from CoinGecko.
- **Get Coin Price By Contract Address**: Get the price of a specific coin from CoinGecko.
- **Get Historical Data**: Get historical data for a coin by ID.
- **Get OHLC**: Get OHLC chart data for a coin by ID.
- **Get Pool Data By Pool Address**: Get data for a specific pool by its address.
- **Get Token Data By Token Address**: Get data for a specific token by its address.
- **Get Trending Coin Categories**: Get trending coin categories.
- **Get Trending Pools**: Get trending pools for a specific network.
- **Get Trending Pools By Network**: Get trending pools for a specific network.
- **Get Top Gainers/Losers**: Get top gainers and losers for a specific duration.
- **Search Coins**: Search for coins by keyword.