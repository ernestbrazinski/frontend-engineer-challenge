/** Public app paths (links, goto, redirects). */
export const ROUTES = {
  home: "/",
  signin: "/signin",
  signup: "/signup",
  passwordRecovery: "/password-recovery",
  terms: "/terms",
  privacy: "/privacy",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
