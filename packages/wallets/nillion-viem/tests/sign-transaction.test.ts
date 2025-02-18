import { createSignerFromKey } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import {
  type LocalAccount,
  type TransactionSerializableLegacy,
  parseGwei,
  parseTransaction,
  recoverTransactionAddress,
  serializeTransaction,
  toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { assert, beforeAll, describe, it } from 'vitest';
import { NillionECDSA, nillionAccount as nilAccount } from '../src';
import { Env, PrivateKeyPerSuite } from './helpers';

describe('Sign Transaction', () => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const address = privateKeyToAccount(toHex(privateKey)).address;

  let client: NillionECDSA;
  let nillionAccount: LocalAccount;
  const seed = crypto.randomUUID();

  beforeAll(async () => {
    const signer = await createSignerFromKey(
      PrivateKeyPerSuite.SignTransaction
    );
    client = new NillionECDSA({
      seed,
      signer,
      chainUrl: Env.nilChainUrl,
      bootnodeUrl: Env.bootnodeUrl,
    });
    const storeId = await client.storePrivateKey({ privateKey });
    nillionAccount = nilAccount({
      seed,
      signer,
      address,
      chainUrl: Env.nilChainUrl,
      privateKeyStoreId: storeId,
      bootnodeUrl: Env.bootnodeUrl,
    });
  });

  it('should sign transaction', async () => {
    const tx: TransactionSerializableLegacy = {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: BigInt('1000000000000000000'),
      chainId: 1,
      type: 'legacy',
      gasPrice: parseGwei('10'),
    };
    const serialized = serializeTransaction(tx);
    const parsed = parseTransaction(serialized);

    const sig = await nillionAccount.signTransaction(parsed);

    const recovered = await recoverTransactionAddress({
      serializedTransaction: sig,
    });

    assert.equal(recovered, address);
  });
});
