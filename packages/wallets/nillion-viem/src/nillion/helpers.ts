import { ValuesPermissionsBuilder } from '@nillion/client-vms';
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
  const perms = ValuesPermissionsBuilder.init().owner(
    _permissions.owner ?? client.config.id
  );

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

  // Add TECDSA Perms
  perms.grantCompute(client.id, Constants.tecdsaProgramId);

  return perms.build();
};
