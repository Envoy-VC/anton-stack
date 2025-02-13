import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import type { OfflineSigner } from '@cosmjs/proto-signing';
import { type Uuid, createSignerFromKey } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import { toHex } from 'viem';
import { type LocalAccount, privateKeyToAccount } from 'viem/accounts';
import { nillionAccount } from '~/viem';
import { NillionECDSA } from '../src/nillion';
import { Env, PrivateKeyPerSuite, type Suite } from './helpers';

export const createClient = async (suite: Suite) => {
  const signer = await createSignerFromKey(PrivateKeyPerSuite[suite]);
  const client = new NillionECDSA({
    seed: Env.seed,
    chainUrl: Env.nilChainUrl,
    bootnodeUrl: Env.bootnodeUrl,
    signer,
  });

  return { client, signer };
};

export interface Context {
  client: NillionECDSA;
  nillionAccount: LocalAccount;
  viemAccount: LocalAccount;
  ecdsa: NillionECDSA;
  signer: OfflineSigner;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  privateKeyStoreId: Uuid;
}

export const setupEnvironment = async (suite: Suite): Promise<Context> => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.getPublicKey(privateKey);
  const viemAccount = privateKeyToAccount(toHex(privateKey));
  const { client, signer } = await createClient(suite);

  const storeId = await client.storePrivateKey({ privateKey });
  const account = nillionAccount({
    privateKeyStoreId: storeId,
    address: viemAccount.address,
    chainUrl: Env.nilChainUrl,
    bootnodeUrl: Env.bootnodeUrl,
    signer,
    seed: Env.seed,
  });

  await client.initialize();

  return {
    client,
    publicKey,
    privateKey,
    nillionAccount: account,
    viemAccount,
    ecdsa: client,
    signer,
    privateKeyStoreId: storeId,
  };
};
