import { type VmClient, VmClientBuilder } from '@nillion/client-vms';
import type { CreateClientProps } from '~/types';

export const createNillionClient = async (
  props: CreateClientProps
): Promise<VmClient> => {
  const client = await new VmClientBuilder()
    .seed(props.seed)
    .bootnodeUrl(props.bootnodeUrl)
    .chainUrl(props.chainUrl)
    .signer(props.signer)
    .build();

  return client;
};
