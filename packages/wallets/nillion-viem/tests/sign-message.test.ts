import { recoverMessageAddress } from 'viem';
import { beforeAll, describe, expect, it } from 'vitest';
import { type Context, prepareEnv } from './prepare-env';

describe('Sign Message', () => {
  let context: Context;

  beforeAll(async () => {
    context = await prepareEnv('SignMessage');
  });

  it('should sign a string message', async () => {
    const { nillionAccount, address } = context;
    const message = 'Hello World';
    const signature = await nillionAccount.signMessage({ message });
    const recovered = await recoverMessageAddress({
      message,
      signature,
    });

    expect(recovered).equals(address);
  });
});
