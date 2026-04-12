/**
 * Request-time access token for Apollo {@link SetContextLink}.
 * Updated by the auth store whenever tokens change (keeps link in sync without circular imports).
 */
let accessToken: string | null = null;

export function setGraphqlAccessToken(token: string | null): void {
  accessToken = token;
}

export function getGraphqlAccessToken(): string | null {
  return accessToken;
}
