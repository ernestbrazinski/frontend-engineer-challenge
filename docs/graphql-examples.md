# GraphQL examples (password reset)

The email link base URL is configured on the backend (`PASSWORD_RESET_FRONTEND_URL`, default `http://localhost:5173`). The user opens:

`/password-recovery?token=<opaque>`

## Request email with reset link

For a **syntactically valid** `email`, the mutation **always** returns `true` (no user enumeration). If the user exists, an email is sent.

```graphql
mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
  requestPasswordReset(input: $input)
}
```

Variables:

```json
{
  "input": {
    "email": "user@example.com"
  }
}
```

## Set a new password using the link token

The token is single-use with a TTL in Redis. Another `requestPasswordReset` for the same email invalidates the previous token.

Password: **at least 8 characters**, **at least one letter** and **at least one digit**. On success — `true`; all user refresh sessions are cleared.

```graphql
mutation CompletePasswordReset($input: CompletePasswordResetInput!) {
  completePasswordReset(input: $input)
}
```

Variables:

```json
{
  "input": {
    "token": "<opaque from ?token= query>",
    "newPassword": "SecretPass1"
  }
}
```

Invalid/expired token errors: see `errors[].message` and `errors[].extensions` (e.g. text like “Invalid or expired reset link”).
