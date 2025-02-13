import process from 'node:process';

export const Env = {
  seed: 'test',
  bootnodeUrl: process.env.NILLION_GRPC_ENDPOINT ?? '',
  chainId: process.env.NILLION_NILCHAIN_CHAIN_ID ?? '',
  nilChainUrl: process.env.NILLION_NILCHAIN_JSON_RPC ?? '',
  nilChainPrivateKey0: process.env.NILLION_NILCHAIN_PRIVATE_KEY_0 ?? '',
  nilChainPrivateKey1: process.env.NILLION_NILCHAIN_PRIVATE_KEY_1 ?? '',
  nilChainPrivateKey2: process.env.NILLION_NILCHAIN_PRIVATE_KEY_2 ?? '',
  nilChainPrivateKey3: process.env.NILLION_NILCHAIN_PRIVATE_KEY_3 ?? '',
  nilChainPrivateKey4: process.env.NILLION_NILCHAIN_PRIVATE_KEY_4 ?? '',
  nilChainPrivateKey5: process.env.NILLION_NILCHAIN_PRIVATE_KEY_5 ?? '',
  nilChainPrivateKey6: process.env.NILLION_NILCHAIN_PRIVATE_KEY_6 ?? '',
  nilChainPrivateKey7: process.env.NILLION_NILCHAIN_PRIVATE_KEY_7 ?? '',
  nilChainPrivateKey8: process.env.NILLION_NILCHAIN_PRIVATE_KEY_8 ?? '',
  nilChainPrivateKey9: process.env.NILLION_NILCHAIN_PRIVATE_KEY_9 ?? '',
  programNamespace: process.env.NILLION_TEST_PROGRAMS_NAMESPACE ?? '',
};

export type Suite =
  | 'Client'
  | 'Store'
  | 'Sign'
  | 'SignMessage'
  | 'SignRawMessage'
  | 'SignTypedData'
  | 'SignTransaction';

export const PrivateKeyPerSuite = {
  Client: Env.nilChainPrivateKey0,
  Store: Env.nilChainPrivateKey1,
  Sign: Env.nilChainPrivateKey2,
  SignMessage: Env.nilChainPrivateKey3,
  SignRawMessage: Env.nilChainPrivateKey4,
  SignTypedData: Env.nilChainPrivateKey5,
  SignTransaction: Env.nilChainPrivateKey6,
};
