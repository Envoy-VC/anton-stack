import { recoverMessageAddress } from 'viem';
import { beforeEach, describe, expect, it } from 'vitest';
import { type Context, setupEnvironment } from './setup';

describe('Sign Message', () => {
  let context: Context;

  beforeEach(async () => {
    context = await setupEnvironment('SignMessage');
  });

  it('should sign a string message', async () => {
    const { nillionAccount, viemAccount } = context;
    const message = 'Hello World';
    const signature = await nillionAccount.signMessage({ message });

    const address = await recoverMessageAddress({
      message,
      signature,
    });

    expect(address).to.equal(viemAccount.address);
  });
});
