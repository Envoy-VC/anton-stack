import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';

import { CoinGeckoAPI } from '~/common/api';
import {
  GetCoinDataParameters,
  GetCoinPriceByContractAddressParameters,
  GetCoinPricesParameters,
  GetHistoricalDataParameters,
  GetOHLCParameters,
  GetPoolDataByPoolAddressParameters,
  GetTokenDataByTokenAddressParameters,
  GetTrendingCoinCategoriesParameters,
  GetTrendingPoolsByNetworkParameters,
  GetTrendingPoolsParameters,
  NoParams,
  SearchCoinsParameters,
  TopGainersLosersParameters,
} from '../common/schema';

import type { z } from 'zod';
import { GetTokensInfoByPoolAddressParameters } from '../common/schema';

class CoinGeckoActionProvider extends ActionProvider<EvmWalletProvider> {
  protected api: CoinGeckoAPI;
  constructor({ apiKey, isPro }: { apiKey: string; isPro?: boolean }) {
    super('temp', []);
    this.api = new CoinGeckoAPI(apiKey, isPro);
  }

  @CreateAction({
    name: 'coingecko_get_trending_coins',
    description: 'Get the list of trending coins from CoinGecko',
    schema: NoParams,
  })
  async getTrendingCoins() {
    return await this.api.request('search/trending', {});
  }

  @CreateAction({
    name: 'coingecko_get_coin_price_by_contract_address',
    description: 'Get the price of a specific coin from CoinGecko',
    schema: GetCoinPricesParameters,
  })
  async getCoinPrices(parameters: z.infer<typeof GetCoinPricesParameters>) {
    const {
      coinIds,
      vsCurrency,
      includeMarketCap,
      include24hrVol,
      include24hrChange,
      includeLastUpdatedAt,
    } = parameters;
    return await this.api.request('simple/price', {
      ids: coinIds.join(','),
      vs_currencies: vsCurrency,
      include_market_cap: includeMarketCap,
      include_24hr_vol: include24hrVol,
      include_24hr_change: include24hrChange,
      include_last_updated_at: includeLastUpdatedAt,
    });
  }

  @CreateAction({
    name: 'coingecko_search_coins',
    description: 'Search for coins by keyword',
    schema: SearchCoinsParameters,
  })
  async searchCoins(parameters: z.infer<typeof SearchCoinsParameters>) {
    const { query } = parameters;
    return await this.api.request('search', {
      query,
    });
  }

  @CreateAction({
    name: 'coingecko_get_coin_price_by_contract_address',
    description: 'Get coin price by contract address',
    schema: GetCoinPriceByContractAddressParameters,
  })
  async getCoinPriceByContractAddress(
    parameters: z.infer<typeof GetCoinPriceByContractAddressParameters>
  ) {
    const {
      id,
      contractAddresses,
      vsCurrency,
      includeMarketCap,
      include24hrVol,
      include24hrChange,
      includeLastUpdatedAt,
    } = parameters;

    return await this.api.request(`simple/token_price/${id}`, {
      contract_addresses: contractAddresses.join(','),
      vs_currencies: vsCurrency,
      include_market_cap: includeMarketCap,
      include_24hr_vol: include24hrVol,
      include_24hr_change: include24hrChange,
      include_last_updated_at: includeLastUpdatedAt,
    });
  }

  @CreateAction({
    name: 'coingecko_get_coin_data',
    description:
      'Get detailed coin data by ID (including contract address, market data, community data, developer stats, and more)',
    schema: GetCoinDataParameters,
  })
  async getCoinData(parameters: z.infer<typeof GetCoinDataParameters>) {
    const {
      id,
      localization,
      tickers,
      marketData,
      communityData,
      developerData,
      sparkline,
    } = parameters;

    return await this.api.request(`coins/${id}`, {
      localization,
      tickers,
      market_data: marketData,
      community_data: communityData,
      developer_data: developerData,
      sparkline,
    });
  }

  @CreateAction({
    name: 'coingecko_get_historical_data',
    description: 'Get historical data for a coin by ID',
    schema: GetHistoricalDataParameters,
  })
  async getHistoricalData(
    parameters: z.infer<typeof GetHistoricalDataParameters>
  ) {
    const { id, date, localization } = parameters;
    return await this.api.request(`coins/${id}/history`, {
      date,
      localization,
    });
  }

  @CreateAction({
    name: 'coingecko_get_ohlc_data',
    description: 'Get OHLC chart data for a coin by ID',
    schema: GetOHLCParameters,
  })
  async getOHLCData(parameters: z.infer<typeof GetOHLCParameters>) {
    const { id, vsCurrency, days } = parameters;
    return await this.api.request(`coins/${id}/ohlc`, {
      vs_currency: vsCurrency,
      days,
    });
  }

  @CreateAction({
    name: 'coingecko_get_trending_coin_categories',
    description: 'Get trending coin categories',
    schema: GetTrendingCoinCategoriesParameters,
  })
  async getTrendingCoinCategories(
    parameters: z.infer<typeof GetTrendingCoinCategoriesParameters>
  ) {
    const {
      vsCurrency,
      ids,
      category,
      order,
      perPage,
      page,
      sparkline,
      priceChangePercentage,
      locale,
    } = parameters;
    return await this.api.request('coins/markets', {
      vs_currency: vsCurrency,
      ids: ids.join(','),
      category,
      order,
      per_page: perPage,
      page,
      sparkline,
      price_change_percentage: priceChangePercentage,
      locale,
    });
  }

  @CreateAction({
    name: 'coingecko_get_coin_categories',
    description: 'Get all coin categories',
    schema: NoParams,
  })
  async coinCategories(_parameters: z.infer<typeof NoParams>) {
    return await this.api.request('coins/categories', {});
  }

  @CreateAction({
    name: 'coingecko_get_pool_data_by_pool_address',
    description: 'Get data for a specific pool by its address',
    schema: GetPoolDataByPoolAddressParameters,
  })
  async getPoolDataByPoolAddress(
    parameters: z.infer<typeof GetPoolDataByPoolAddressParameters>
  ) {
    const { network, addresses } = parameters;
    return await this.api.request(
      `coins/${network}/pools/multi/${addresses.join(',')}`,
      {}
    );
  }

  @CreateAction({
    name: 'coingecko_get_trending_pools',
    description: 'Get trending pools for a specific network',
    schema: GetTrendingPoolsParameters,
  })
  async getTrendingPools(
    parameters: z.infer<typeof GetTrendingPoolsParameters>
  ) {
    const { include, page, duration } = parameters;
    return await this.api.request('onchain/networks/trending_pools', {
      include: include.join(','),
      page,
      duration,
    });
  }

  @CreateAction({
    name: 'coingecko_get_trending_pools_by_network',
    description: 'Get trending pools for a specific network',
    schema: GetTrendingPoolsByNetworkParameters,
  })
  async getTrendingPoolsByNetwork(
    parameters: z.infer<typeof GetTrendingPoolsByNetworkParameters>
  ) {
    const { network } = parameters;
    return await this.api.request(
      `onchain/networks/${network}/trending_pools`,
      {}
    );
  }

  @CreateAction({
    name: 'coingecko_get_top_gainers_losers',
    description: 'Get top gainers and losers for a specific duration',
    schema: TopGainersLosersParameters,
  })
  async getTopGainersLosers(
    parameters: z.infer<typeof TopGainersLosersParameters>
  ) {
    const { vsCurrency, duration, topCoins } = parameters;
    return await this.api.request('coins/top_gainers_losers', {
      vs_currency: vsCurrency,
      duration,
      top_coins: topCoins,
    });
  }

  @CreateAction({
    name: 'coingecko_get_token_data_by_token_address',
    description: 'Get data for a specific token by its address',
    schema: GetTokenDataByTokenAddressParameters,
  })
  async getTokenDataByTokenAddress(
    parameters: z.infer<typeof GetTokenDataByTokenAddressParameters>
  ) {
    const { network, address } = parameters;
    return await this.api.request(
      `onchain/networks/${network}/tokens/${address}/info`,
      {}
    );
  }

  @CreateAction({
    name: 'coingecko_get_tokens_info_by_pool_address',
    description: 'Get data for all tokens in a specific pool by its address',
    schema: GetTokensInfoByPoolAddressParameters,
  })
  async getTokensInfoByPoolAddress(
    parameters: z.infer<typeof GetTokensInfoByPoolAddressParameters>
  ) {
    const { network, poolAddress } = parameters;
    return await this.api.request(
      `onchain/networks/${network}/pools/${poolAddress}/tokens`,
      {}
    );
  }

  supportsNetwork = (_network: Network) => true;
}

export const coinGeckoActionProvider = (params: {
  apiKey: string;
  isPro?: boolean;
}) => new CoinGeckoActionProvider(params);
