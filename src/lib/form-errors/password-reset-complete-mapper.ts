import {
  graphqlRequestFailureFromUnknown,
  type GraphqlRequestFailure,
} from "$lib/graphql/graphql-request-errors";

export type PasswordResetCompleteFormErrors = {
  newPassword?: string;
  passwordConfirm?: string;
  form?: string;
};

const invalidResetLinkPattern = /invalid\s+or\s+expired\s+reset\s+link/i;

function looksLikeInvalidResetLink(failure: GraphqlRequestFailure): boolean {
  return failure.messages.some((m) => invalidResetLinkPattern.test(m));
}

function defaultFormMessage(failure: GraphqlRequestFailure): string {
  return failure.messages.join("\n").trim() || "Не удалось сменить пароль";
}

export function mapGraphqlFailureToPasswordResetCompleteFormErrors(
  failure: GraphqlRequestFailure,
): PasswordResetCompleteFormErrors {
  if (looksLikeInvalidResetLink(failure)) {
    return {
      form: "Ссылка недействительна или срок её действия истёк. Запросите восстановление пароля снова.",
    };
  }
  return { form: defaultFormMessage(failure) };
}

export function mapUnknownErrorToPasswordResetCompleteFormErrors(
  err: unknown,
): PasswordResetCompleteFormErrors {
  const msg = err instanceof Error ? err.message : String(err);
  if (invalidResetLinkPattern.test(msg)) {
    return {
      form: "Ссылка недействительна или срок её действия истёк. Запросите восстановление пароля снова.",
    };
  }
  return { form: msg };
}

export function mapPasswordResetCompleteServerError(
  err: unknown,
): PasswordResetCompleteFormErrors {
  const failure = graphqlRequestFailureFromUnknown(err);
  if (failure) return mapGraphqlFailureToPasswordResetCompleteFormErrors(failure);
  return mapUnknownErrorToPasswordResetCompleteFormErrors(err);
}
