import * as GoogleStrategy from 'passport-google-oauth20';
import { AuthSource } from '@appname/utils/types/data/user';
import { createOrUpdateGoogleUser } from '../services/auth/google';
import { setAuthToken } from '../services/auth/jwt';
import {
  buildAuthRoutes,
  FAILURE_ERROR_REDIRECT,
  REGISTER_SUCCESS_REDIRECT,
  LOGIN_SUCCESS_REDIRECT,
  OauthMiddlewareFunction,
  deleteOauthSession,
} from './oauth';

const PROVIDER = AuthSource.Google;
const { route, callback } = buildAuthRoutes(PROVIDER);
const GOOGLE_SCOPE = ['profile', 'email', 'openid'];

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: callback,
    passReqToCallback: true,
  },
  async function(request, accessToken, refreshToken, profileResponse, done) {
    try {
      const { user, errors } = await createOrUpdateGoogleUser({
        request,
        profileResponse,
        accessToken,
        refreshToken,
      });

      if (errors || !user) {
        const message = errors ? errors.message : 'User not found';
        console.log('--- ERROR message', message);
        // LOG SENTRY
        return done(null, false, message);
      }

      return done(null, user);
    } catch (error) {
      console.log('--- ERROR', error);
      return done(error, null);
    }
  },
);

const google: OauthMiddlewareFunction = ({ app, passport }) => {
  passport.use(googleStrategy);

  app.get(route, passport.authenticate(PROVIDER, { scope: GOOGLE_SCOPE }));
  app.get(
    callback,
    passport.authenticate(PROVIDER, { failureRedirect: FAILURE_ERROR_REDIRECT }),
    (req, res) => {
      // if username, redirect somewhere else, if not then take them to set username page
      setAuthToken(req, res);
      deleteOauthSession(res);
      return res.redirect(true ? REGISTER_SUCCESS_REDIRECT : LOGIN_SUCCESS_REDIRECT);
    },
  );
};

export default google;
