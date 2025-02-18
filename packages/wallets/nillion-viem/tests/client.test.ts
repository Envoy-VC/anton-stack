import { NillionECDSA } from '../src/nillion';

import type { OfflineSigner } from '@cosmjs/proto-signing';
import { createSignerFromKey } from '@nillion/client-vms';
import { beforeEach, describe, expect, it } from 'vitest';
import { Env, PrivateKeyPerSuite } from './helpers.js';

describe('Nillion ECDSA Client', () => {
  let signer: OfflineSigner;

  beforeEach(async () => {
    signer = await createSignerFromKey(PrivateKeyPerSuite.Client);
  });

  it('should create a new client', () => {
    const client = new NillionECDSA({
      signer,
      seed: Env.seed,
      chainUrl: Env.nilChainUrl,
      bootnodeUrl: Env.bootnodeUrl,
    });

    expect(client).to.exist;
  });

  it('should be able to connect to devnet', async () => {
    const client = new NillionECDSA({
      seed: Env.seed,
      chainUrl: Env.nilChainUrl,
      bootnodeUrl: Env.bootnodeUrl,
      signer,
    });

    const vm = await client.initialize();
    expect(vm).to.exist;
  });
});
