import { PassportStatic } from 'passport';
import { Express, Response } from 'express';

interface OauthMiddleware {
  app: Express;
  passport: PassportStatic;
}
export type OauthMiddlewareFunction = (payload: OauthMiddleware) => void;

export const AUTH_ROUTE_PREFIX = '/auth';
export const FAILURE_ERROR_REDIRECT = '/login/error';
export const REGISTER_SUCCESS_REDIRECT = '/my/settings/set-username';
export const LOGIN_SUCCESS_REDIRECT = '/';
export const PASSPORT_SESSION_NAME = 'appauth';
export const PASSPORT_SESSION_SIG = `${PASSPORT_SESSION_NAME}.sig`;
export const PASSPORT_SESSION_CONFIG = {
  name: PASSPORT_SESSION_NAME,
  keys: [process.env.EXPRESS_SESSION_SECRET],
  maxAge: 0,
};

export const buildAuthRoutes = provider => ({
  route: `${AUTH_ROUTE_PREFIX}/${provider}`,
  callback: `${AUTH_ROUTE_PREFIX}/${provider}/callback`,
});

export const deleteOauthSession = (res: Response) => {
  res.cookie(PASSPORT_SESSION_NAME, '');
  res.clearCookie(PASSPORT_SESSION_NAME);
  res.cookie(PASSPORT_SESSION_SIG, '');
  res.clearCookie(PASSPORT_SESSION_SIG);

  return res;
};
