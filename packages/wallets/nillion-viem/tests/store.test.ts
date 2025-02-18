import { createSignerFromKey } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import { beforeAll, describe, expect, it } from 'vitest';
import { NillionECDSA } from '../src/nillion';
import { Env, PrivateKeyPerSuite } from './helpers';

describe('Store Private Key', () => {
  let client: NillionECDSA;
  const seed = crypto.randomUUID();

  beforeAll(async () => {
    const signer = await createSignerFromKey(PrivateKeyPerSuite.Store);
    client = new NillionECDSA({
      seed,
      signer,
      chainUrl: Env.nilChainUrl,
      bootnodeUrl: Env.bootnodeUrl,
    });
  });

  it('should store private key', async () => {
    const privateKey = secp256k1.utils.randomPrivateKey();
    const storeId = await client.storePrivateKey({ privateKey });

    expect(storeId).toHaveLength(36);
  });
});
