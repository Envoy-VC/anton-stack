// Program Id
const tecdsaProgramId = 'builtin/tecdsa_sign';

// Input Store Names
const tecdsaKeyName = 'tecdsa_private_key';
const tecdsaDigestName = 'tecdsa_digest_message';
const tecdsaSignatureName = 'tecdsa_signature';

// Party Names
const tecdsaKeyParty = 'tecdsa_key_party';
const tecdsaDigestParty = 'tecdsa_digest_message_party';
const tecdsaOutputParty = 'tecdsa_output_party';

export const Constants = {
  tecdsaProgramId,
  tecdsaKeyName,
  tecdsaDigestName,
  tecdsaSignatureName,
  tecdsaKeyParty,
  tecdsaDigestParty,
  tecdsaOutputParty,
} as const;
