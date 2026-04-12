import { ClientError } from "graphql-request";

import {
  firstGraphqlErrorCode,
  graphqlErrorCodesList,
} from "$lib/graphql/errors";

/** Normalized GraphQL error from a `graphql-request` response. */
export type GraphqlRequestFailure = {
  /** `errors[0].extensions.code` */
  primaryCode: string | undefined;
  /** All `extensions.code` values in order. */
  codes: readonly string[];
  /** Messages from `errors[].message`. */
  messages: readonly string[];
};

export function graphqlRequestFailureFromUnknown(
  err: unknown,
): GraphqlRequestFailure | null {
  if (!(err instanceof ClientError)) return null;
  const errors = err.response.errors;
  const messages =
    errors?.map((e) => e.message).filter((m): m is string => Boolean(m)) ?? [];
  return {
    primaryCode: firstGraphqlErrorCode(errors),
    codes: graphqlErrorCodesList(errors),
    messages: messages.length > 0 ? messages : [err.message],
  };
}
