import { ValuesPermissionsBuilder } from '@nillion/client-vms';
import type { SignatureType } from '@noble/curves/abstract/weierstrass';
import { type Signature, numberToHex } from 'viem';
import type { BuildPermissionProps, PermissionsProps } from '~/types';
import { Constants } from './constants';

export const buildPermissions = ({
  permissions,
  client,
}: BuildPermissionProps) => {
  let _permissions: PermissionsProps;
  if (permissions) {
    _permissions = permissions;
  } else {
    _permissions = {};
  }

  const perms = ValuesPermissionsBuilder.defaultOwner(
    _permissions.owner ?? client.id
  )
    // Add TECDSA Perms
    .grantCompute(client.id, Constants.tecdsaProgramId);

  for (const user of _permissions.retrieve ?? []) {
    perms.grantRetrieve(user);
  }
  for (const user of _permissions.update ?? []) {
    perms.grantUpdate(user);
  }
  for (const user of _permissions.delete ?? []) {
    perms.grantDelete(user);
  }
  for (const { user, programId } of _permissions.compute ?? []) {
    perms.grantCompute(user, programId);
  }

  return perms.build();
};

export const buildCompleteSignature = (
  signature: SignatureType,
  digest: Uint8Array
) => {
  let updated = signature;
  // Normalize s
  if (signature.hasHighS()) {
    updated = signature.normalizeS();
  }

  for (let _recovery = 0; _recovery < 2; _recovery++) {
    try {
      const _updated = signature.addRecoveryBit(_recovery);
      const recoveredPubKey = _updated.recoverPublicKey(digest);
      if (recoveredPubKey) {
        updated = _updated;
        break;
      }
    } catch {
      updated = signature;
    }
  }

  if (updated.recovery === undefined) {
    throw new Error('Failed to determine recovery bit');
  }

  const yParity = updated.recovery === 1 ? 1 : 0;
  const sig: Signature = {
    r: numberToHex(updated.r),
    s: numberToHex(updated.s),
    yParity,
  };
  return sig;
};
