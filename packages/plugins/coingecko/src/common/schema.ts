import { z } from 'zod';

export const GetCoinPricesParameters = z.object({
  coinIds: z
    .array(z.string())
    .describe("The ID of the coin on CoinGecko (e.g., 'bitcoin', 'eth')"),
  vsCurrency: z
    .string()
    .default('usd')
    .describe(
      "The target currency to get price in (e.g., 'usd', 'eur', 'jpy')"
    ),
  includeMarketCap: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include market cap data in the response'),
  include24hrVol: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include 24 hour volume data in the response'),
  include24hrChange: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include 24 hour price change data in the response'),
  includeLastUpdatedAt: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include last updated timestamp in the response'),
});

export const SearchCoinsParameters = z.object({
  query: z
    .string()
    .describe("The search query to find coins (e.g., 'bitcoin' or 'btc')"),
});

export const GetCoinPriceByContractAddressParameters = z.object({
  id: z.string().describe("Asset platform's id (e.g., 'eth')"),
  contractAddresses: z
    .array(z.string())
    .describe('List of contract addresses for the tokens'),
  vsCurrency: z
    .string()
    .default('usd')
    .describe("Target currency (e.g., 'usd', 'eur')"),
  includeMarketCap: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include market cap data'),
  include24hrVol: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include 24hr volume'),
  include24hrChange: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include 24hr change'),
  includeLastUpdatedAt: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include last updated timestamp'),
});

export const GetCoinDataParameters = z.object({
  id: z
    .string()
    .describe(
      'Pass the coin id (can be obtained from the supported coins endpoint)'
    ),
  localization: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include all localizations'),
  tickers: z
    .boolean()
    .optional()
    .default(true)
    .describe('Include tickers data'),
  marketData: z
    .boolean()
    .optional()
    .default(true)
    .describe('Include market data'),
  communityData: z
    .boolean()
    .optional()
    .default(true)
    .describe('Include community data'),
  developerData: z
    .boolean()
    .optional()
    .default(true)
    .describe('Include developer data'),
  sparkline: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include sparkline 7 days data'),
});

export const GetHistoricalDataParameters = z.object({
  id: z
    .string()
    .describe(
      'Pass the coin id (can be obtained from the supported coins endpoint)'
    ),
  date: z.string().describe('The date of data snapshot in dd-mm-yyyy format'),
  localization: z
    .boolean()
    .optional()
    .default(true)
    .describe('Include localized languages'),
});

export const GetOHLCParameters = z.object({
  id: z
    .string()
    .describe(
      'Pass the coin id (can be obtained from the supported coins endpoint)'
    ),
  vsCurrency: z
    .string()
    .default('usd')
    .describe('The target currency of market data (usd, eur, jpy, etc.)'),
  days: z
    .number()
    .describe('Data up to number of days ago (1/7/14/30/90/180/365/max)'),
});

export const GetTrendingCoinCategoriesParameters = z.object({
  vsCurrency: z
    .string()
    .default('usd')
    .describe('The target currency of market data (usd, eur, jpy, etc.)'),
  ids: z
    .array(z.string())
    .describe('The ids of the coins to get trending data for'),
  category: z.string().describe('The category to get trending data for'),
  order: z
    .enum(['market_cap_desc', 'volume_desc', 'volume_asc', 'market_cap_asc'])
    .describe('The order to get trending data for'),
  perPage: z
    .number()
    .min(1)
    .max(30)
    .default(10)
    .describe('The number of trending coins to get'),
  page: z.number().describe('The page number to get trending coins for'),
  sparkline: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include sparkline 7 days data'),
  priceChangePercentage: z
    .enum(['1h', '24h', '7d', '14d', '30d', '200d', '1y'])
    .optional()
    .default('24h')
    .describe('The price change percentage to get trending coins for'),
  locale: z
    .string()
    .optional()
    .default('en')
    .describe('The locale to get trending coins for'),
});

export const GetPoolDataByPoolAddressParameters = z.object({
  network: z
    .string()
    .describe("The network id to get data for (e.g., 'eth', 'polygon_pos')"),
  addresses: z
    .array(z.string())
    .describe('The addresses of the pools to get data for'),
});

export const GetTrendingPoolsByNetworkParameters = z.object({
  network: z
    .string()
    .describe("The network id to get data for (e.g., 'eth', 'polygon_pos')"),
});

export const GetTrendingPoolsParameters = z.object({
  include: z
    .array(z.enum(['base_token', 'quote_token', 'dex', 'network']))
    .describe('The fields to include in the response'),
  page: z
    .number()
    .max(10)
    .describe('The page number to get trending pools for'),
  duration: z
    .enum(['24h', '6h', '1h', '5m'])
    .describe('The duration to get trending pools for'),
});

export const TopGainersLosersParameters = z.object({
  vsCurrency: z
    .string()
    .default('usd')
    .describe('The target currency of market data (usd, eur, jpy, etc.)'),
  duration: z
    .enum(['1h', '24h', '7d', '14d', '30d', '60d', '1y'])
    .optional()
    .default('24h')
    .describe('The duration to get top gainers/losers for'),
  topCoins: z
    .enum(['300', '500', '1000', 'all'])
    .optional()
    .default('1000')
    .describe('The number of top coins to get'),
});

export const GetTokenDataByTokenAddressParameters = z.object({
  network: z
    .string()
    .describe("The network id to get data for (e.g., 'eth', 'polygon_pos')"),
  address: z.string().describe('The address of the token to get data for'),
});

export const GetTokensInfoByPoolAddressParameters = z.object({
  network: z
    .string()
    .describe("The network id to get data for (e.g., 'eth', 'polygon_pos')"),
  poolAddress: z.string().describe('The address of the pool to get data for'),
});
