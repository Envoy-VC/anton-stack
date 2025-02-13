import {
  type TransactionSerializableLegacy,
  parseGwei,
  parseTransaction,
  recoverTransactionAddress,
  serializeTransaction,
} from 'viem';
import { beforeEach, describe, expect, it } from 'vitest';
import { type Context, setupEnvironment } from './setup';

describe('Sign Transaction', () => {
  let context: Context;

  beforeEach(async () => {
    context = await setupEnvironment('SignTransaction');
  });

  it('should sign transaction', async () => {
    const { nillionAccount, viemAccount } = context;
    const tx: TransactionSerializableLegacy = {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: BigInt('1000000000000000000'),
      chainId: 1,
      type: 'legacy',
      gasPrice: parseGwei('10'),
    };
    const serialized = serializeTransaction(tx);
    const parsed = parseTransaction(serialized);

    const sig = await nillionAccount.signTransaction(parsed);

    const address = await recoverTransactionAddress({
      serializedTransaction: sig,
    });
    console.log('Ending sign transaction...');

    expect(address).to.be.eq(viemAccount.address);
  });
});
