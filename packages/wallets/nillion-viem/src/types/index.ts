import type { OfflineSigner } from '@cosmjs/proto-signing';
import type { ProgramId, UserId, Uuid, VmClient } from '@nillion/client-vms';
import type { Hash, Hex, SignableMessage } from 'viem';

export interface CreateClientProps {
  seed: string;
  signer: OfflineSigner;
  chainUrl: string;
  bootnodeUrl: string;
}

export type To = 'object' | 'bytes' | 'hex';

export interface NillionECDSAProps extends CreateClientProps {}

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
export interface SignProps<to extends To = 'object'> {
  privateKeyStoreId: Uuid;
  message: Hash;
  to: to | To | undefined;
}

export interface SignMessageProps {
  privateKeyStoreId: Uuid;
  message: SignableMessage;
}

export type WithPrivateKeyStoreId<T> = T & {
  privateKeyStoreId: Uuid;
};

/** Nillion Account */
export interface NillionAccountProps extends CreateClientProps {
  address: Hex;
  privateKeyStoreId: Uuid;
}
