import { GraphQLClient } from "graphql-request";
import { browser } from "$app/environment";
import { getGraphqlHttpUrl } from "./client";
import { getGraphqlAccessToken } from "./token-source";

let browserClient: GraphQLClient | null = null;

/** Browser client: same URL and Authorization header as Apollo. */
export function getGraphQLRequestClient(): GraphQLClient {
  if (!browser) {
    throw new Error("GraphQL request client is only available in the browser");
  }
  if (!browserClient) {
    browserClient = new GraphQLClient(getGraphqlHttpUrl(), {
      headers: () => {
        const token = getGraphqlAccessToken();
        const headers: Record<string, string> = {};
        if (token) headers.authorization = `Bearer ${token}`;
        return headers;
      },
    });
  }
  return browserClient;
}
