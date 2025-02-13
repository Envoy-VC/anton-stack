import { beforeEach, describe, expect, it } from 'vitest';
import type { NillionECDSA } from '../src/nillion';
import { createClient } from './setup';

import type { OfflineSigner } from '@cosmjs/proto-signing';
import { secp256k1 } from '@noble/curves/secp256k1';

describe('Store Private Key', () => {
  let client: {
    client: NillionECDSA;
    signer: OfflineSigner;
  };

  beforeEach(async () => {
    client = await createClient('Store');
  });

  it('should store private key', async () => {
    const privateKey = secp256k1.utils.randomPrivateKey();
    const storeId = await client.client.storePrivateKey({ privateKey });

    expect(storeId).toHaveLength(36);
  });
});
