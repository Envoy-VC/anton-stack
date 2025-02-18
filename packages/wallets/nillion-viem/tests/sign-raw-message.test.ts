import { recoverMessageAddress, stringToBytes } from 'viem';
import { beforeAll, describe, expect, it } from 'vitest';
import { type Context, prepareEnv } from './prepare-env';

describe('Sign Raw Message', () => {
  let context: Context;

  beforeAll(async () => {
    context = await prepareEnv('SignRawMessage');
  });

  it('should sign a raw message', async () => {
    const { nillionAccount, address } = context;
    const raw = stringToBytes('Hello World!');
    const signature = await nillionAccount.signMessage({
      message: { raw },
    });

    const recovered = await recoverMessageAddress({
      message: { raw },
      signature,
    });

    expect(recovered).equals(address);
  });
});
