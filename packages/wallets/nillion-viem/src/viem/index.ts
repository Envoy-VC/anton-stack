import { type LocalAccount, toAccount } from 'viem/accounts';
import type { NillionAccountProps } from '~/types';

export const nillionAccount = (_props: NillionAccountProps): LocalAccount => {
  const { address, privateKeyStoreId, publicKey, ecdsaClient: ecdsa } = _props;
  const account = toAccount({
    address: address,
    async signMessage({ message }) {
      return await ecdsa.signMessage({
        message,
        privateKeyStoreId,
        publicKey,
      });
    },
    async signTransaction(transaction, { serializer } = {}) {
      return await ecdsa.signTransaction({
        transaction,
        privateKeyStoreId,
        publicKey,
        serializer,
      });
    },
    async signTypedData({ ...typedData }) {
      return await ecdsa.signTypedData({
        privateKeyStoreId,
        publicKey,
        data: typedData,
        to: 'hex',
      });
    },
  });

  return {
    ...account,
    publicKey,
    source: 'nillion',
    type: 'local',
  };
};
