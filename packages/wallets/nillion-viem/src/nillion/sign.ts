import type { EcdsaSignature } from '@nillion/client-wasm';
import { Constants } from './constants';

import type { VmClient } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToBigInt, serializeSignature } from 'viem';
import type { SignReturnType } from 'viem/accounts';
import type { To, WithKeys } from '~/types';
import { buildCompleteSignature } from './helpers';
import { storedDigestMessage } from './store';

type SignProps<to extends To = 'object'> = WithKeys<{
  client: VmClient;
  digestMessage: Uint8Array;
  to?: to | To | undefined;
}>;

export const sign = async <to extends To = 'object'>({
  client,
  privateKeyStoreId,
  digestMessage,
  publicKey,
  to = 'object',
}: SignProps<to>): Promise<SignReturnType<to>> => {
  const digestMessageStoreId = await storedDigestMessage({
    client,
    message: digestMessage,
  });
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

  const sig = new secp256k1.Signature(
    bytesToBigInt(res.r()),
    bytesToBigInt(res.s())
  );

  const signature = buildCompleteSignature(sig, digestMessage, publicKey);

  return (() => {
    if (to === 'bytes' || to === 'hex') {
      return serializeSignature({ ...signature, to: to });
    }
    return signature;
  })() as SignReturnType<to>;
};
