/** Values for `extensions.code` in GraphQL API responses. */
export const GRAPHQL_ERROR_CODE = {
  /** Registration; sign-in may return the same code for invalid credentials. */
  EMAIL_ALREADY_REGISTERED: "EMAIL_ALREADY_REGISTERED",
  /** Invalid credentials on sign-in (when the API sends this code). */
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
} as const;

export type GraphqlErrorCode =
  (typeof GRAPHQL_ERROR_CODE)[keyof typeof GRAPHQL_ERROR_CODE];
