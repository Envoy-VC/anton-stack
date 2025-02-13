import { recoverMessageAddress, stringToHex } from 'viem';
import { beforeEach, describe, expect, it } from 'vitest';
import { type Context, setupEnvironment } from './setup';

describe('Sign Raw Message', () => {
  let context: Context;

  beforeEach(async () => {
    context = await setupEnvironment('SignRawMessage');
  });

  it('should sign a raw message', async () => {
    const { nillionAccount, viemAccount } = context;
    const raw = stringToHex('Hello World!');
    const signature = await nillionAccount.signMessage({
      message: { raw },
    });

    const address = await recoverMessageAddress({
      message: { raw },
      signature,
    });

    expect(address).to.equal(viemAccount.address);
  });
});
