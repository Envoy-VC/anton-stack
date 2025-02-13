import { type LocalAccount, toAccount } from 'viem/accounts';
import { NillionECDSA } from '~/nillion';
import type { NillionAccountProps } from '~/types';

export const nillionAccount = (_props: NillionAccountProps): LocalAccount => {
  const { address, privateKeyStoreId, ...props } = _props;
  const ecdsa = new NillionECDSA(props);
  const account = toAccount({
    address: address,
    async signMessage({ message }) {
      return await ecdsa.signMessage({ message, privateKeyStoreId });
    },
    async signTransaction(transaction, { serializer } = {}) {
      return await ecdsa.signTransaction({
        transaction,
        privateKeyStoreId,
        serializer,
      });
    },
    async signTypedData({ ...typedData }) {
      return await ecdsa.signTypedData({
        privateKeyStoreId,
        data: typedData,
        to: 'hex',
      });
    },
  });

  return {
    ...account,
    source: 'nillion',
    type: 'local',
  };
};
