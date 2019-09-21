export const HASURA_CLAIMS_KEY = 'https://hasura.io/jwt/claims';

// This should actually be an enym
export enum HasuraClaimKey {
  AllowedRoles = 'x-hasura-allowed-roles',
  DefaultRole = 'x-hasura-default-role',
  UserID = 'x-hasura-user-id',
}
