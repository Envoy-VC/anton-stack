import {
  ActionProvider,
  CreateAction,
  type EvmWalletProvider,
  type Network,
} from '@coinbase/agentkit';
import type { z } from 'zod';

import {
  GetNftCollectionStatisticsParametersSchema,
  type GetNftCollectionStatisticsResponseSchema,
  GetNftSalesParametersSchema,
  type GetNftSalesResponseSchema,
} from '../common/schema';
class OpenseaActionProvider extends ActionProvider<EvmWalletProvider> {
  private readonly apiKey: string;
  constructor({ apiKey }: { apiKey: string }) {
    super('opensea', []);
    this.apiKey = apiKey;
  }

  @CreateAction({
    name: 'opensea_get_collection_statistics',
    description: 'Get NFT collection statistics',
    schema: GetNftCollectionStatisticsParametersSchema,
  })
  async getNftCollectionStatistics(
    parameters: z.infer<typeof GetNftCollectionStatisticsParametersSchema>
  ) {
    let nftCollectionStatistics: z.infer<
      typeof GetNftCollectionStatisticsResponseSchema
    >;
    try {
      const response = await fetch(
        `https://api.opensea.io/api/v2/collections/${parameters.collectionSlug}/stats`,
        {
          headers: {
            accept: 'application/json',
            'x-api-key': this.apiKey,
          },
        }
      );

      nftCollectionStatistics = (await response.json()) as z.infer<
        typeof GetNftCollectionStatisticsResponseSchema
      >;
    } catch (error) {
      throw new Error(`Failed to get NFT collection statistics: ${error}`);
    }

    return nftCollectionStatistics;
  }

  @CreateAction({
    name: 'opensea_get_sales',
    description: 'Get recent NFT Sales',
    schema: GetNftSalesParametersSchema,
  })
  async getNftSales(parameters: z.infer<typeof GetNftSalesParametersSchema>) {
    let nftSales: z.infer<typeof GetNftSalesResponseSchema>;
    try {
      const response = await fetch(
        `https://api.opensea.io/api/v2/events/collection/${parameters.collectionSlug}?event_type=sale&limit=5`,
        {
          headers: {
            accept: 'application/json',
            'x-api-key': this.apiKey,
          },
        }
      );

      nftSales = (await response.json()) as z.infer<
        typeof GetNftSalesResponseSchema
      >;
    } catch (error) {
      throw new Error(`Failed to get NFT sales: ${error}`);
    }

    return nftSales.asset_events.map((event) => {
      return {
        name: event.nft.name,
        seller: event.seller,
        buyer: event.buyer,
        price: Number(event.payment.quantity) / 10 ** 18,
      };
    });
  }

  supportsNetwork = (_network: Network): boolean => true;
}

export const openseaActionProvider = ({ apiKey }: { apiKey: string }) =>
  new OpenseaActionProvider({ apiKey });
