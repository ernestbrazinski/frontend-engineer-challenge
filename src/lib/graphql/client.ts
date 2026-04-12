import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { from } from "@apollo/client/link";
import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";
import { getGraphqlAccessToken } from "./token-source";

export const DEFAULT_GRAPHQL_HTTP_URL = "http://localhost:3080/graphql";

export function getGraphqlHttpUrl(): string {
  const fromEnv = env.PUBLIC_GRAPHQL_HTTP_URL;
  if (typeof fromEnv === "string" && fromEnv.length > 0) return fromEnv;
  return DEFAULT_GRAPHQL_HTTP_URL;
}

const authLink = new SetContextLink((prev) => {
  const token = getGraphqlAccessToken();
  return {
    headers: {
      ...(prev.headers as Record<string, string> | undefined),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

let browserClient: ApolloClient | null = null;

export function getApolloClient(): ApolloClient {
  if (!browser) {
    throw new Error("Apollo Client is only available in the browser");
  }
  if (!browserClient) {
    const httpLink = new HttpLink({
      uri: getGraphqlHttpUrl(),
      fetch,
    });
    browserClient = new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: { fetchPolicy: "network-only" },
        query: { fetchPolicy: "network-only" },
        mutate: { errorPolicy: "none" },
      },
    });
  }
  return browserClient;
}
