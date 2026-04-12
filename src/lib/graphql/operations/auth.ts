import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`;

export const REFRESH_SESSION_MUTATION = gql`
  mutation RefreshSession($input: RefreshInput!) {
    refreshSession(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: RefreshInput!) {
    logout(input: $input)
  }
`;

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input)
  }
`;

export const COMPLETE_PASSWORD_RESET_MUTATION = gql`
  mutation CompletePasswordReset($input: CompletePasswordResetInput!) {
    completePasswordReset(input: $input)
  }
`;
