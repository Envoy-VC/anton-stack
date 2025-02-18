import { secp256k1 } from '@noble/curves/secp256k1';
import { type Hex, toHex } from 'viem';

import { createSignerFromKey } from '@nillion/client-vms';
import { privateKeyToAddress } from 'viem/accounts';
import { NillionECDSA, nillionAccount as nilAccount } from '../src';
import { Env, PrivateKeyPerSuite, type Suite } from './helpers';

export const createSignerForSuite = async (suite: Suite) => {
  return await createSignerFromKey(PrivateKeyPerSuite[suite]);
};

export interface Context {
  privateKey: Uint8Array;
  publicKey: Hex;
  address: Hex;
  seed: string;
  ecdsaClient: NillionECDSA;
  nillionAccount: ReturnType<typeof nilAccount>;
}

export const prepareEnv = async (suite: Suite): Promise<Context> => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = toHex(secp256k1.getPublicKey(privateKey));
  const address = privateKeyToAddress(toHex(privateKey));

  const seed = crypto.randomUUID();

  const signer = await createSignerForSuite(suite);

  const ecdsaClient = new NillionECDSA({
    seed,
    signer,
    chainUrl: Env.nilChainUrl,
    bootnodeUrl: Env.bootnodeUrl,
  });
  const privateKeyStoreId = await ecdsaClient.storePrivateKey({ privateKey });

  const nillionAccount = nilAccount({
    ecdsaClient,
    publicKey,
    address,
    privateKeyStoreId,
  });

  return {
    privateKey,
    publicKey,
    address,
    seed,
    ecdsaClient,
    nillionAccount,
  };
};
