import { GRAPHQL_ERROR_CODE } from "$lib/constants/graphql-error-codes";
import {
  graphqlRequestFailureFromUnknown,
  type GraphqlRequestFailure,
} from "$lib/graphql/graphql-request-errors";

export type SignUpFormErrors = {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  form?: string;
};

const defaultFormMessage = (failure: GraphqlRequestFailure): string =>
  failure.messages.join("\n").trim() || "Произошла ошибка";

/** Map GraphQL failures to sign-up form fields (extend `switch` for new codes). */
export function mapGraphqlFailureToSignUpFormErrors(
  failure: GraphqlRequestFailure,
): SignUpFormErrors {
  switch (failure.primaryCode) {
    case GRAPHQL_ERROR_CODE.EMAIL_ALREADY_REGISTERED:
      return { email: "Данный адрес уже занят" };
    default:
      return { form: defaultFormMessage(failure) };
  }
}

/** Map non-GraphQL failures (network, etc.) to sign-up form errors. */
export function mapUnknownErrorToSignUpFormErrors(err: unknown): SignUpFormErrors {
  if (err instanceof Error) return { form: err.message };
  return { form: String(err) };
}

/** Single entry point from UI: any sign-up submit server error → form fields. */
export function mapSignUpServerError(err: unknown): SignUpFormErrors {
  const failure = graphqlRequestFailureFromUnknown(err);
  if (failure) return mapGraphqlFailureToSignUpFormErrors(failure);
  return mapUnknownErrorToSignUpFormErrors(err);
}
