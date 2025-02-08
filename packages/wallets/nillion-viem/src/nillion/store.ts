import type { Uuid, VmClient } from '@nillion/client-vms';
import { NadaValue } from '@nillion/client-vms';
import type { BuildPermissionProps } from '~/types';
import { Constants } from './constants';
import { buildPermissions } from './helpers';

interface StorePrivateKeyProps {
  client: VmClient;
  privateKey: Uint8Array;
  ttl?: number;
  permissions?: BuildPermissionProps['permissions'];
}

export const storePrivateKey = async (
  props: StorePrivateKeyProps
): Promise<Uuid> => {
  const { client, privateKey, ttl } = props;
  const permissions = buildPermissions({
    permissions: props.permissions,
    client,
  });

  const builder = client
    .storeValues()
    .ttl(ttl ?? 1)
    .value(
      Constants.tecdsaKeyName,
      NadaValue.new_ecdsa_private_key(privateKey)
    );

  if (permissions) {
    builder.permissions(permissions);
  }

  const storeId = await builder.build().invoke();

  return storeId;
};

interface StoreDigestMessage {
  client: VmClient;
  message: Uint8Array;
  ttl?: number;
  permissions?: BuildPermissionProps['permissions'];
}

export const storedDigestMessage = async (
  props: StoreDigestMessage
): Promise<Uuid> => {
  const { client, message, ttl } = props;
  const permissions = buildPermissions({
    permissions: props.permissions,
    client,
  });

  const builder = client
    .storeValues()
    .ttl(ttl ?? 1)
    .value(
      Constants.tecdsaDigestName,
      NadaValue.new_ecdsa_digest_message(message)
    );

  if (permissions) {
    builder.permissions(permissions);
  }

  const storeId = await builder.build().invoke();

  return storeId;
};
