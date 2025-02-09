# Nillion Viem Account

Implementation of the Nillion tECDSA with the [Viem](https://viem.sh) Wallet Account.

## Installation

```bash
npm install @anton-stack/nillion-viem-account
# or
yarn add @anton-stack/nillion-viem-account
# or
pnpm install @anton-stack/nillion-viem-account
```

## Usage
```ts
import { nillionAccount } from '@anton-stack/nillion-viem-account';
import { createSignerFromKey } from '@nillion/client-vms';
import { http, type Hex, createWalletClient } from 'viem';
import { baseSepolia } from 'viem/chains';


const signer = await createSignerFromKey(env.NILLION_PK);

const account = nillionAccount({
    chainUrl: env.NILLION_CHAIN_URL,
    bootnodeUrl: env.NILLION_BOOTNODE_URL,
    seed: 'test,
    address: '0x...',
    privateKeyStoreId: props.privateKeyStoreId,
    signer,
});

const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
});
```