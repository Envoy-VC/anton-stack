import { createSignerFromKey } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import { type LocalAccount, recoverMessageAddress, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { assert, beforeAll, describe, it } from 'vitest';
import { NillionECDSA, nillionAccount as nilAccount } from '../src';
import { Env, PrivateKeyPerSuite } from './helpers';

describe('Sign Message', () => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const address = privateKeyToAccount(toHex(privateKey)).address;

  let client: NillionECDSA;
  let nillionAccount: LocalAccount;
  const seed = crypto.randomUUID();

  beforeAll(async () => {
    const signer = await createSignerFromKey(PrivateKeyPerSuite.SignMessage);
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

  it('should sign a string message', async () => {
    const message = 'Hello World';
    const signature = await nillionAccount.signMessage({ message });
    const recovered = await recoverMessageAddress({
      message,
      signature,
    });
    assert.equal(recovered, address);
  });
});
