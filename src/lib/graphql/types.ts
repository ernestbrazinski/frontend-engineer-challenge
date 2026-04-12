/** Mirrors `schema.gql` / engineer-challenge GraphQL schema. */

export interface UserGql {
  id: string;
  email: string;
}

export interface AuthPayloadGql {
  accessToken: string;
  refreshToken: string;
  user: UserGql;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface CompletePasswordResetInput {
  token: string;
  newPassword: string;
}
