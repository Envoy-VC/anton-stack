import { ValuesPermissionsBuilder } from '@nillion/client-vms';
import type { SignatureType } from '@noble/curves/abstract/weierstrass';
import { secp256k1 } from '@noble/curves/secp256k1';
import { type Hex, bytesToBigInt, toHex } from 'viem';
import type { BuildPermissionProps, PermissionsProps } from '~/types';
import { Constants } from './constants';

/**
 * Builds a permissions object for Nillion values using the ValuesPermissionsBuilder.
 *
 * @param options - The options for building permissions
 * @param options.permissions - Optional permissions configuration object
 * @param options.permissions.owner - Optional owner ID to override the default client ID
 * @param options.permissions.retrieve - Optional array of user IDs granted retrieve permission
 * @param options.permissions.update - Optional array of user IDs granted update permission
 * @param options.permissions.delete - Optional array of user IDs granted delete permission
 * @param options.permissions.compute - Optional array of compute permission objects containing user ID and program ID
 * @param options.client - The client object containing the client ID
 *
 * @returns A built permissions object that can be used with Nillion operations
 *
 * @example
 * ```typescript
 * const permissions = buildPermissions({
 *   permissions: {
 *     owner: "<ownerId>",
 *     retrieve: ["<userId_1>", "<userId_2>"],
 *     compute: [{ user: "<userId_3>", programId: "<programId>" }]
 *   },
 *   client,
 * });
 * ```
 */
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

/**
 * Modulo operation
 * @param a - The number to be divided
 * @param b - The divisor
 * @returns The remainder of the division
 */
const mod = (a: bigint, b: bigint): bigint => {
  const result = a % b;
  return result >= BigInt(0) ? result : b + result;
};

/**
 * Modulo operation with secp256k1.CURVE.n
 * @param a - The number to be divided
 * @returns The remainder of the division
 */
const modN = (a: bigint) => {
  return mod(a, secp256k1.CURVE.n);
};

/**
 * Inverse modulo operation with secp256k1.CURVE.n
 * @param a - The number to be inverted
 * @returns The inverted number
 */
const invN = (a: bigint) => {
  return invert(a, secp256k1.CURVE.n);
};

/**
 * Converts a byte array to a big integer by interpreting it as a big-endian number,
 * with special handling for curves where the bit length is not a multiple of 8.
 *
 * @param bytes - The input byte array to convert
 * @throws {Error} If the input byte array is larger than 8192 bytes
 * @returns A BigInt representing the interpreted value, truncated to the curve's bit length if necessary
 *
 * @remarks
 * For curves where nBitLength is not divisible by 8, the function handles the edge case where
 * bits2octets(bits2octets(m)) !== bits2octets(m) by truncating to the leftmost nBitLength bits.
 */
const bits2int = (bytes: Uint8Array): bigint => {
  // Check for large input data
  if (bytes.length > 8192) {
    throw new Error('input is too large');
  }
  // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
  // for some cases, since bytes.length * 8 is not actual bitLength.
  const num = bytesToBigInt(bytes);
  const delta = bytes.length * 8 - secp256k1.CURVE.nBitLength; // truncate to nBitLength leftmost bits
  return delta > 0 ? num >> BigInt(delta) : num;
};

/**
 * Converts a byte array to a big integer by interpreting it as a big-endian number,
 * @param bytes - The input byte array to convert
 * @returns A BigInt representing the interpreted value, truncated to the curve's bit length if necessary
 */
const bits2int_modN = (bytes: Uint8Array): bigint => {
  return modN(bits2int(bytes));
};

/**
 * Computes the modular multiplicative inverse of a number using the extended Euclidean algorithm.
 * For a number a and modulus m, finds x such that (a * x) % m = 1.
 *
 * @param number - The number to find the modular multiplicative inverse for
 * @param modulo - The modulus to compute the inverse with respect to
 * @returns The modular multiplicative inverse as a BigInt
 * @throws {Error} If the input number is zero
 * @throws {Error} If the modulus is not positive
 * @throws {Error} If the inverse does not exist (when number and modulo are not coprime)
 *
 * @remarks
 * This implementation uses the extended Euclidean algorithm which is more efficient than
 * using Fermat's little theorem. The function includes optimizations for JIT compilation.
 *
 * @example
 * ```typescript
 * const inverse = invert(7n, 11n); // Returns 8n because (7 * 8) % 11 = 1
 * ```
 */
const invert = (number: bigint, modulo: bigint): bigint => {
  if (number === BigInt(0)) {
    throw new Error('invert: expected non-zero number');
  }
  if (modulo <= BigInt(0)) {
    throw new Error(`invert: expected positive modulus, got ${modulo}`);
  }
  // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
  let a = mod(number, modulo);
  let b = modulo;
  let x = BigInt(0),
    y = BigInt(1),
    u = BigInt(1),
    v = BigInt(0);
  while (a !== BigInt(0)) {
    // JIT applies optimization if those two lines follow each other
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a;
    a = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }
  const gcd = b;
  if (gcd !== BigInt(1)) {
    throw new Error('invert: does not exist');
  }
  return mod(x, modulo);
};

/**
 * Builds a complete signature object from a raw signature, message digest, and public key.
 * This function performs ECDSA signature recovery to determine the yParity (recovery bit)
 * and formats the signature components into a standardized structure.
 *
 * @param signature - The raw signature object containing r and s values
 * @param digest - The message digest (hash) that was signed
 * @param publicKey - The public key of the signer in hexadecimal format (with '0x' prefix)
 *
 * @returns An object containing:
 *   - r: The r component of the signature in hex format
 *   - s: The s component of the signature in hex format
 *   - yParity: The recovery bit (0 or 1) used for signature recovery
 *
 * @throws {Error} If the signature recovery point R cannot be computed
 *
 * @example
 * ```typescript
 * const signature = { r: 123n, s: 456n };
 * const digest = new Uint8Array([...]);
 * const publicKey = "0x...";
 * const completeSig = buildCompleteSignature(signature, digest, publicKey);
 * ```
 */
export const buildCompleteSignature = (
  signature: SignatureType,
  digest: Uint8Array,
  publicKey: Hex
) => {
  const P = secp256k1.ProjectivePoint.fromHex(publicKey.slice(2));
  const h = bits2int_modN(digest);
  const is = invN(signature.s);
  const u1 = modN(h * is);
  const u2 = modN(signature.r * is);
  const R = secp256k1.ProjectivePoint.BASE.multiplyAndAddUnsafe(
    P,
    u1,
    u2
  )?.toAffine();
  if (!R) {
    throw new Error('R is undefined');
  }
  const recoveryId = R.y & 1n ? 1 : 0;

  const sig = {
    r: toHex(signature.r),
    s: toHex(signature.s),
    yParity: recoveryId,
  };

  return sig;
};
