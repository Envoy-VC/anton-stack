import { parseGwei, recoverTransactionAddress } from 'viem';
import { beforeAll, describe, expect, it } from 'vitest';
import {} from './helpers';
import { type Context, prepareEnv } from './prepare-env';

describe('Sign Transaction', () => {
  let context: Context;

  beforeAll(async () => {
    context = await prepareEnv('SignTransaction');
  });

  it('should sign transaction', async () => {
    const { nillionAccount, address } = context;

    const sig = await nillionAccount.signTransaction({
      chainId: 1,
      maxFeePerGas: parseGwei('20'),
      maxPriorityFeePerGas: parseGwei('3'),
      gas: 21000n,
      nonce: 69,
      to: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      value: parseGwei('1'),
      data: '0x01',
    });

    const recovered = await recoverTransactionAddress({
      serializedTransaction: sig,
    });

    expect(recovered).equals(address);
  });
});
