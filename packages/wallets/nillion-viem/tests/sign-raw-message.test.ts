import { createSignerFromKey } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import {
  type LocalAccount,
  recoverMessageAddress,
  stringToBytes,
  toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { assert, beforeAll, describe, it } from 'vitest';
import { NillionECDSA, nillionAccount as nilAccount } from '../src';
import { Env, PrivateKeyPerSuite } from './helpers';

describe('Sign Raw Message', () => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const address = privateKeyToAccount(toHex(privateKey)).address;

  let client: NillionECDSA;
  let nillionAccount: LocalAccount;
  const seed = crypto.randomUUID();

  beforeAll(async () => {
    const signer = await createSignerFromKey(PrivateKeyPerSuite.SignRawMessage);
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

  it('should sign a raw message', async () => {
    const raw = stringToBytes('Hello World!');
    const signature = await nillionAccount.signMessage({
      message: { raw },
    });

    const recovered = await recoverMessageAddress({
      message: { raw },
      signature,
    });

    assert.equal(recovered, address);
  });
});
