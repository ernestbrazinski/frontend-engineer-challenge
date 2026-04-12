import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import type { GraphQLError } from "graphql";

function extensionCode(
  ext: GraphQLError["extensions"] | undefined,
): string | undefined {
  if (!ext || typeof ext !== "object") return undefined;
  const code = (ext as Record<string, unknown>).code;
  return typeof code === "string" && code.length > 0 ? code : undefined;
}

/** `errors[0].extensions.code` (e.g. graphql-request or HTTP response). */
export function firstGraphqlErrorCode(
  errors: readonly GraphQLError[] | undefined,
): string | undefined {
  return extensionCode(errors?.[0]?.extensions);
}

/** All non-empty `extensions.code` values in `errors` order. */
export function graphqlErrorCodesList(
  errors: readonly GraphQLError[] | undefined,
): string[] {
  if (!errors?.length) return [];
  const out: string[] = [];
  for (const e of errors) {
    const c = extensionCode(e.extensions);
    if (c) out.push(c);
  }
  return out;
}

export function formatGraphqlError(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const parts = error.errors.map((e) => e.message).filter(Boolean);
    if (parts.length) return parts.join("\n");
    return error.message;
  }
  if (ServerError.is(error)) {
    return `HTTP ${error.statusCode}: сервер вернул ошибку`;
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

export function isNetworkishError(error: unknown): boolean {
  return ServerError.is(error);
}
