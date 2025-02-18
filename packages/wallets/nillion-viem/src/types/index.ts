import type { OfflineSigner } from '@cosmjs/proto-signing';
import type { ProgramId, UserId, Uuid, VmClient } from '@nillion/client-vms';
import type { Hash, Hex, SignableMessage } from 'viem';
import type { NillionECDSA } from '..';

export interface CreateClientProps {
  seed: string;
  signer: OfflineSigner;
  chainUrl: string;
  bootnodeUrl: string;
}

export type To = 'object' | 'bytes' | 'hex';

export interface NillionECDSAProps extends CreateClientProps {}

export type WithKeys<T> = T & {
  publicKey: Hex;
  privateKeyStoreId: Uuid;
};

export interface PermissionsProps {
  owner?: UserId;
  retrieve?: UserId[];
  update?: UserId[];
  delete?: UserId[];
  compute?: {
    user: UserId;
    programId: ProgramId;
  }[];
}

export interface BuildPermissionProps {
  client: VmClient;
  permissions?: PermissionsProps;
}

export interface StorePrivateKeyProps {
  privateKey: Uint8Array;
  ttl?: number;
  permissions?: BuildPermissionProps['permissions'];
}

export type SignProps<to extends To = 'object'> = WithKeys<{
  message: Hash;
  to: to | To | undefined;
}>;

export type SignMessageProps = WithKeys<{
  message: SignableMessage;
}>;

/** Nillion Account */
export type NillionAccountProps = WithKeys<{
  ecdsaClient: NillionECDSA;
  address: Hex;
}>;
