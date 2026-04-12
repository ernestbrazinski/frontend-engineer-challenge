import { GRAPHQL_ERROR_CODE } from "$lib/constants/graphql-error-codes";
import {
  graphqlRequestFailureFromUnknown,
  type GraphqlRequestFailure,
} from "$lib/graphql/graphql-request-errors";

export type SignInFormErrors = {
  email?: string;
  password?: string;
};

const wrongCredentialsMessage = "Введены неверные данные";

const invalidCredentialText = /invalid\s+credentials?/i;

function messagesLookLikeInvalidCredentials(
  failure: GraphqlRequestFailure,
): boolean {
  return failure.messages.some((m) => invalidCredentialText.test(m));
}

function failureHasCode(
  failure: GraphqlRequestFailure,
  code: string,
): boolean {
  return (
    failure.primaryCode === code ||
    failure.codes.some((c) => c === code)
  );
}

export function mapGraphqlFailureToSignInFormErrors(
  failure: GraphqlRequestFailure,
): SignInFormErrors {
  if (
    failureHasCode(failure, GRAPHQL_ERROR_CODE.EMAIL_ALREADY_REGISTERED) ||
    failureHasCode(failure, GRAPHQL_ERROR_CODE.INVALID_CREDENTIALS)
  ) {
    return { password: wrongCredentialsMessage };
  }
  if (messagesLookLikeInvalidCredentials(failure)) {
    return { password: wrongCredentialsMessage };
  }
  const fallback =
    failure.messages.join("\n").trim() || "Произошла ошибка";
  return { password: fallback };
}

export function mapUnknownErrorToSignInFormErrors(err: unknown): SignInFormErrors {
  const msg = err instanceof Error ? err.message : String(err);
  if (invalidCredentialText.test(msg)) {
    return { password: wrongCredentialsMessage };
  }
  return { password: msg };
}

export function mapSignInServerError(err: unknown): SignInFormErrors {
  const failure = graphqlRequestFailureFromUnknown(err);
  if (failure) return mapGraphqlFailureToSignInFormErrors(failure);
  return mapUnknownErrorToSignInFormErrors(err);
}
