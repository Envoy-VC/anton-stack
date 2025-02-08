import { beforeAll, describe, expect, test } from 'vitest';
import { NillionECDSA } from '../src/nillion';

import type { OfflineSigner } from '@cosmjs/proto-signing';
import { createSignerFromKey } from '@nillion/client-vms';
import { Env, PrivateKeyPerSuite } from './helpers';

let signer: OfflineSigner;

beforeAll(async () => {
  signer = await createSignerFromKey(PrivateKeyPerSuite.Transactions);
});

describe('Nillion ECDSA Tests', () => {
  test('should create a new client', () => {
    const client = new NillionECDSA({
      seed: Env.seed,
      chainUrl: Env.nilChainUrl,
      bootnodeUrl: Env.bootnodeUrl,
      signer,
    });

    expect(client).toBeDefined();
  });

  test('should be able to connect to devnet', async () => {
    const client = new NillionECDSA({
      seed: Env.seed,
      chainUrl: Env.nilChainUrl,
      bootnodeUrl: Env.bootnodeUrl,
      signer,
    });

    const vm = await client.initialize();
    console.log(vm);

    expect(vm).toBeDefined();
  });
});
