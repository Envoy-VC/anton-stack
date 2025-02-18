import { recoverTypedDataAddress } from 'viem';
import { beforeAll, describe, expect, it } from 'vitest';
import { type Context, prepareEnv } from './prepare-env';

describe('Sign Typed Data', () => {
  let context: Context;

  beforeAll(async () => {
    context = await prepareEnv('SignTypedData');
  });

  it('should sign a simple typed data', async () => {
    const { nillionAccount, address } = context;
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

    expect(recovered).equals(address);
  });
});
