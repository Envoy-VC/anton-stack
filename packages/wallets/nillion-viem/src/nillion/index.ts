import type { OfflineSigner } from '@cosmjs/proto-signing';
import type { Uuid, VmClient } from '@nillion/client-vms';
import type {
  NillionECDSAProps,
  SignMessageProps,
  SignProps,
  StorePrivateKeyProps,
  To,
  WithPrivateKeyStoreId,
} from '~/types';

import {
  type GetTransactionType,
  type Hex,
  type SerializeTransactionFn,
  type TransactionSerializable,
  type TransactionSerialized,
  type TypedData,
  type TypedDataDefinition,
  hashMessage,
  hashTypedData,
  hexToBytes,
  keccak256,
  serializeTransaction,
} from 'viem';
import type { SignReturnType, SignTransactionParameters } from 'viem/accounts';
import { createNillionClient } from './client';
import { sign } from './sign';
import { storePrivateKey } from './store';

type SignTransactionReturnType<
  serializer extends
    SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0],
> = TransactionSerialized<GetTransactionType<transaction>>;

export class NillionECDSA {
  private seed: string;
  private signer: OfflineSigner;
  private chainUrl: string;
  private bootnodeUrl: string;
  client: VmClient | null;

  constructor(props: NillionECDSAProps) {
    this.seed = props.seed;
    this.signer = props.signer;
    this.chainUrl = props.chainUrl;
    this.bootnodeUrl = props.bootnodeUrl;
    this.client = null;
  }

  async initialize() {
    if (!this.client) {
      this.client = await createNillionClient({
        seed: this.seed,
        signer: this.signer,
        chainUrl: this.chainUrl,
        bootnodeUrl: this.bootnodeUrl,
      });
    }
    return this.client;
  }

  async storePrivateKey(props: StorePrivateKeyProps): Promise<Uuid> {
    const client = await this.initialize();
    const uuid = await storePrivateKey({ client, ...props });
    return uuid;
  }

  async sign<to extends To = 'object'>({
    message,
    privateKeyStoreId,
    to = 'object',
  }: SignProps<to>): Promise<SignReturnType<to>> {
    const client = await this.initialize();
    const byteMessage = hexToBytes(message);

    const signature = await sign({
      client,
      digestMessage: byteMessage,
      privateKeyStoreId,
      to,
    });
    return signature;
  }

  async signMessage({
    message,
    privateKeyStoreId,
  }: SignMessageProps): Promise<Hex> {
    const client = await this.initialize();
    const hashedMessage = hashMessage(message, 'bytes');
    const signature = await sign({
      client,
      digestMessage: hashedMessage,
      privateKeyStoreId,
      to: 'hex',
    });
    return signature;
  }

  async signTransaction<
    serializer extends
      SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
    transaction extends Parameters<serializer>[0] = Parameters<serializer>[0],
  >(
    parameters: WithPrivateKeyStoreId<
      Omit<SignTransactionParameters<serializer, transaction>, 'privateKey'>
    >
  ) {
    const {
      privateKeyStoreId,
      transaction: _transaction,
      serializer: _serializer = serializeTransaction,
    } = parameters;

    const signableTransaction = (() => {
      // For EIP-4844 Transactions, we want to sign the transaction payload body (tx_payload_body) without the sidecars (ie. without the network wrapper).
      // See: https://github.com/ethereum/EIPs/blob/e00f4daa66bd56e2dbd5f1d36d09fd613811a48b/EIPS/eip-4844.md#networking
      if (_transaction.type === 'eip4844') {
        return {
          ..._transaction,
          sidecars: false,
        };
      }
      return _transaction;
    })();

    const signature = await this.sign({
      message: keccak256(_serializer(signableTransaction)),
      privateKeyStoreId,
      to: 'object',
    });

    return _serializer(_transaction, signature) as SignTransactionReturnType<
      serializer,
      transaction
    >;
  }

  async signTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain',
    to extends To = 'object',
  >(
    parameters: WithPrivateKeyStoreId<{
      data: TypedDataDefinition<typedData, primaryType>;
      to?: to | To | undefined;
    }>
  ): Promise<SignReturnType<to>> {
    const { data, privateKeyStoreId, to: _to } = parameters;
    const signature = await this.sign({
      message: hashTypedData(data),
      privateKeyStoreId: privateKeyStoreId,
      to: _to,
    });
    return signature;
  }
}

export * from './constants';
