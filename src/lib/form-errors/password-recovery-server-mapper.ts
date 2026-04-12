import {
  graphqlRequestFailureFromUnknown,
  type GraphqlRequestFailure,
} from "$lib/graphql/graphql-request-errors";

export type PasswordRecoveryFormErrors = {
  email?: string;
};

const defaultEmailMessage = (failure: GraphqlRequestFailure): string =>
  failure.messages.join("\n").trim() || "Не удалось отправить запрос";

export function mapGraphqlFailureToPasswordRecoveryFormErrors(
  failure: GraphqlRequestFailure,
): PasswordRecoveryFormErrors {
  return { email: defaultEmailMessage(failure) };
}

export function mapUnknownErrorToPasswordRecoveryFormErrors(
  err: unknown,
): PasswordRecoveryFormErrors {
  if (err instanceof Error) return { email: err.message };
  return { email: String(err) };
}

export function mapPasswordRecoveryServerError(
  err: unknown,
): PasswordRecoveryFormErrors {
  const failure = graphqlRequestFailureFromUnknown(err);
  if (failure) return mapGraphqlFailureToPasswordRecoveryFormErrors(failure);
  return mapUnknownErrorToPasswordRecoveryFormErrors(err);
}
