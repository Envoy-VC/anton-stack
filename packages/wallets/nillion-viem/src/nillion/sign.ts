import type { EcdsaSignature } from '@nillion/client-wasm';
import { Constants } from './constants';

import type { Uuid, VmClient } from '@nillion/client-vms';
import { compactSignatureToSignature, serializeSignature, toHex } from 'viem';
import type { SignReturnType } from 'viem/accounts';
import type { To } from '~/types';

type SignProps<to extends To = 'object'> = {
  client: VmClient;
  privateKeyStoreId: Uuid;
  digestMessageStoreId: Uuid;
  to?: to | To | undefined;
};

export const sign = async <to extends To = 'object'>({
  client,
  privateKeyStoreId,
  digestMessageStoreId,
  to = 'object',
}: SignProps<to>): Promise<SignReturnType<to>> => {
  const computeResultId = await client
    .invokeCompute()
    .program(Constants.tecdsaProgramId)
    .inputParty(Constants.tecdsaKeyParty, client.id)
    .inputParty(Constants.tecdsaDigestParty, client.id)
    .outputParty(Constants.tecdsaOutputParty, [client.id])
    .valueIds(privateKeyStoreId, digestMessageStoreId)
    .build()
    .invoke();

  const computeResult = await client
    .retrieveComputeResult()
    .id(computeResultId)
    .build()
    .invoke();

  const res = computeResult[Constants.tecdsaSignatureName]
    ?.value as EcdsaSignature;

  const signature = compactSignatureToSignature({
    r: toHex(res.r()),
    yParityAndS: toHex(res.s()),
  });

  return (() => {
    if (to === 'bytes' || to === 'hex') {
      return serializeSignature({ ...signature, to: to });
    }
    return signature;
  })() as SignReturnType<to>;
};
