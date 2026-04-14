import { getApolloClient } from "$lib/graphql/client";
import { formatGraphqlError, isNetworkishError } from "$lib/graphql/errors";
import type { ApiResult } from "$lib/graphql/result";
import type {
  AuthPayloadGql,
  CompletePasswordResetInput,
  LoginInput,
  RefreshInput,
  RegisterInput,
  RequestPasswordResetInput,
  UserGql,
} from "$lib/graphql/types";
import {
  COMPLETE_PASSWORD_RESET_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  REFRESH_SESSION_MUTATION,
  REGISTER_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
} from "$lib/graphql/operations/auth";

function fail<T>(error: unknown): ApiResult<T> {
  return {
    ok: false,
    error: formatGraphqlError(error),
    network: isNetworkishError(error),
    cause: error,
  };
}

/** Typed GraphQL calls for auth (browser-only client). */
export const authService = {
  async fetchMe(): Promise<ApiResult<UserGql | null>> {
    try {
      const { data } = await getApolloClient().query<{ me: UserGql | null }>({
        query: ME_QUERY,
      });
      return { ok: true, data: data?.me ?? null };
    } catch (e) {
      return fail(e);
    }
  },

  async login(input: LoginInput): Promise<ApiResult<AuthPayloadGql>> {
    try {
      const { data } = await getApolloClient().mutate<{
        login: AuthPayloadGql;
      }>({
        mutation: LOGIN_MUTATION,
        variables: { input },
      });
      if (!data?.login) {
        return { ok: false, error: "Пустой ответ сервера" };
      }
      return { ok: true, data: data.login };
    } catch (e) {
      return fail(e);
    }
  },

  async register(input: RegisterInput): Promise<ApiResult<AuthPayloadGql>> {
    try {
      const { data } = await getApolloClient().mutate<{
        register: AuthPayloadGql;
      }>({
        mutation: REGISTER_MUTATION,
        variables: { input },
      });
      if (!data?.register) {
        return { ok: false, error: "Пустой ответ сервера" };
      }
      return { ok: true, data: data.register };
    } catch (e) {
      return fail(e);
    }
  },

  async refreshSession(
    input: RefreshInput,
  ): Promise<ApiResult<AuthPayloadGql>> {
    try {
      const { data } = await getApolloClient().mutate<{
        refreshSession: AuthPayloadGql;
      }>({
        mutation: REFRESH_SESSION_MUTATION,
        variables: { input },
      });
      if (!data?.refreshSession) {
        return { ok: false, error: "Пустой ответ сервера" };
      }
      return { ok: true, data: data.refreshSession };
    } catch (e) {
      return fail(e);
    }
  },

  async logout(input: RefreshInput): Promise<ApiResult<boolean>> {
    try {
      const { data } = await getApolloClient().mutate<{ logout: boolean }>({
        mutation: LOGOUT_MUTATION,
        variables: { input },
      });
      return { ok: true, data: Boolean(data?.logout) };
    } catch (e) {
      return fail(e);
    }
  },

  async requestPasswordReset(
    input: RequestPasswordResetInput,
  ): Promise<ApiResult<boolean>> {
    try {
      const { data } = await getApolloClient().mutate<{
        requestPasswordReset: boolean;
      }>({
        mutation: REQUEST_PASSWORD_RESET_MUTATION,
        variables: { input },
      });
      return { ok: true, data: Boolean(data?.requestPasswordReset) };
    } catch (e) {
      return fail(e);
    }
  },

  async completePasswordReset(
    input: CompletePasswordResetInput,
  ): Promise<ApiResult<boolean>> {
    try {
      const { data } = await getApolloClient().mutate<{
        completePasswordReset: boolean;
      }>({
        mutation: COMPLETE_PASSWORD_RESET_MUTATION,
        variables: { input },
      });
      return { ok: true, data: Boolean(data?.completePasswordReset) };
    } catch (e) {
      return fail(e);
    }
  },
};
