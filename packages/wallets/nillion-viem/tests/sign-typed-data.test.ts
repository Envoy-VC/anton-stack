import { createSignerFromKey } from '@nillion/client-vms';
import { secp256k1 } from '@noble/curves/secp256k1';
import { type LocalAccount, recoverTypedDataAddress, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { assert, beforeAll, describe, it } from 'vitest';
import { NillionECDSA, nillionAccount as nilAccount } from '../src';
import { Env, PrivateKeyPerSuite } from './helpers';

describe('Sign Typed Data', () => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const address = privateKeyToAccount(toHex(privateKey)).address;

  let client: NillionECDSA;
  let nillionAccount: LocalAccount;
  const seed = crypto.randomUUID();

  beforeAll(async () => {
    const signer = await createSignerFromKey(PrivateKeyPerSuite.SignTypedData);
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

  it('should sign a simple typed data', async () => {
    const domain = {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    } as const;

    const types = {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    } as const;

    const data = {
      domain,
      types,
      primaryType: 'Mail',
      message: {
        from: {
          name: 'Alice',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    } as const;
    const signature = await nillionAccount.signTypedData(data);

    const recovered = await recoverTypedDataAddress({
      ...data,
      signature,
    });

    assert.equal(recovered, address);
  });
});
