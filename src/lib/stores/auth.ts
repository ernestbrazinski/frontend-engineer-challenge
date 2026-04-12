import { browser } from "$app/environment";
import { derived, get, writable } from "svelte/store";
import { setGraphqlAccessToken } from "$lib/graphql/token-source";
import type {
  AuthPayloadGql,
  CompletePasswordResetInput,
  UserGql,
} from "$lib/graphql/types";
import { authService } from "$lib/services/authService";

const STORAGE_ACCESS = "orbitto.auth.accessToken";
const STORAGE_REFRESH = "orbitto.auth.refreshToken";

export type AuthStatus = "idle" | "hydrating" | "authenticated" | "anonymous";

export interface AuthSnapshot {
  user: UserGql | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  busy: boolean;
  busyOp: string | null;
  error: string | null;
}

const initial: AuthSnapshot = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  busy: false,
  busyOp: null,
  error: null,
};

export const auth = writable<AuthSnapshot>(initial);

export const isAuthenticated = derived(auth, ($a) =>
  Boolean($a.accessToken && $a.user),
);

let hydrateGeneration = 0;

function persistTokens(access: string | null, refresh: string | null): void {
  if (!browser) return;
  if (access) localStorage.setItem(STORAGE_ACCESS, access);
  else localStorage.removeItem(STORAGE_ACCESS);
  if (refresh) localStorage.setItem(STORAGE_REFRESH, refresh);
  else localStorage.removeItem(STORAGE_REFRESH);
}

function applyAuthPayload(payload: AuthPayloadGql): void {
  setGraphqlAccessToken(payload.accessToken);
  persistTokens(payload.accessToken, payload.refreshToken);
  auth.update((a) => ({
    ...a,
    user: payload.user,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    status: "authenticated",
    error: null,
  }));
}

/** Persist session after a successful mutation (login, register, etc.). */
export function commitAuthPayload(payload: AuthPayloadGql): void {
  applyAuthPayload(payload);
}

export function startAuthOperation(op: string): void {
  begin(op);
}

export function finishAuthOperation(): void {
  end();
}

function begin(op: string): void {
  auth.update((a) => ({
    ...a,
    busy: true,
    busyOp: op,
    error: null,
  }));
}

function end(): void {
  auth.update((a) => ({
    ...a,
    busy: false,
    busyOp: null,
  }));
}

/** Load tokens from storage and restore session (`me` / refresh). */
export async function hydrateAuth(): Promise<void> {
  if (!browser) return;
  const gen = ++hydrateGeneration;
  begin("hydrate");
  auth.update((a) => ({ ...a, status: "hydrating" }));

  try {
    const at = localStorage.getItem(STORAGE_ACCESS);
    const rt = localStorage.getItem(STORAGE_REFRESH);
    if (!at || !rt) {
      auth.update((a) => ({
        ...a,
        status: "anonymous",
        accessToken: null,
        refreshToken: null,
        user: null,
      }));
      setGraphqlAccessToken(null);
      return;
    }

    setGraphqlAccessToken(at);
    auth.update((a) => ({
      ...a,
      accessToken: at,
      refreshToken: rt,
    }));

    const me = await authService.fetchMe();

    if (gen !== hydrateGeneration) return;

    if (me.ok && me.data) {
      auth.update((a) => ({
        ...a,
        user: me.data!,
        status: "authenticated",
        error: null,
      }));
    } else {
      const refreshed = await authService.refreshSession({
        refreshToken: rt,
      });
      if (gen !== hydrateGeneration) return;
      if (refreshed.ok) {
        applyAuthPayload(refreshed.data);
      } else {
        clearSession();
        const message = me.ok ? refreshed.error : me.error;
        auth.update((a) => ({ ...a, error: message }));
      }
    }
  } finally {
    if (gen === hydrateGeneration) end();
  }
}

export function clearSessionError(): void {
  auth.update((a) => ({ ...a, error: null }));
}

export function clearSession(): void {
  persistTokens(null, null);
  setGraphqlAccessToken(null);
  auth.set({
    ...initial,
    status: "anonymous",
  });
}

export async function login(email: string, password: string): Promise<boolean> {
  begin("login");
  const res = await authService.login({ email, password });
  end();
  if (res.ok) {
    applyAuthPayload(res.data);
    return true;
  }
  auth.update((a) => ({ ...a, error: res.error }));
  return false;
}

export async function register(
  email: string,
  password: string,
): Promise<boolean> {
  begin("register");
  const res = await authService.register({ email, password });
  end();
  if (res.ok) {
    applyAuthPayload(res.data);
    return true;
  }
  auth.update((a) => ({ ...a, error: res.error }));
  return false;
}

export async function logout(): Promise<void> {
  const rt = get(auth).refreshToken;
  begin("logout");
  if (rt) {
    await authService.logout({ refreshToken: rt });
  }
  clearSession();
  end();
}

export async function refreshAuth(): Promise<boolean> {
  const rt = get(auth).refreshToken;
  if (!rt) return false;
  begin("refresh");
  const res = await authService.refreshSession({ refreshToken: rt });
  end();
  if (res.ok) {
    applyAuthPayload(res.data);
    return true;
  }
  clearSession();
  auth.update((a) => ({ ...a, error: res.error }));
  return false;
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  begin("requestPasswordReset");
  const res = await authService.requestPasswordReset({ email });
  end();
  if (res.ok) return true;
  auth.update((a) => ({ ...a, error: res.error }));
  return false;
}

export async function completePasswordReset(
  input: CompletePasswordResetInput,
): Promise<boolean> {
  begin("completePasswordReset");
  const res = await authService.completePasswordReset(input);
  end();
  if (res.ok) return true;
  auth.update((a) => ({ ...a, error: res.error }));
  return false;
}
