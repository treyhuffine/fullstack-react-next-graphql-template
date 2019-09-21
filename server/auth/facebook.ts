import * as FacebookStrategy from 'passport-facebook';
import { AuthSource } from '@appname/utils/types/data/user';
// TODO: Update once TS 'paths' work again
import { createOrUpdateFacebookUser } from '../services/auth/facebook';
import { setAuthToken } from '../services/auth/jwt';
import {
  buildAuthRoutes,
  FAILURE_ERROR_REDIRECT,
  REGISTER_SUCCESS_REDIRECT,
  LOGIN_SUCCESS_REDIRECT,
  OauthMiddlewareFunction,
  deleteOauthSession,
} from './oauth';

const PROVIDER = AuthSource.Facebook;
const { route, callback } = buildAuthRoutes(PROVIDER);
const FACEBOOK_SCOPE = ['email', 'user_birthday', 'user_gender'];
const FACEBOOK_PROFILE_FIELDS = [
  'id',
  'displayName',
  'photos',
  'emails',
  'name',
  'gender',
  'birthday',
];

const facebookStrategy = new FacebookStrategy.Strategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL: callback,
    profileFields: FACEBOOK_PROFILE_FIELDS,
    passReqToCallback: true,
  },
  async function(request, accessToken, refreshToken, profileResponse, done) {
    try {
      const { user, errors } = await createOrUpdateFacebookUser({
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

const facebook: OauthMiddlewareFunction = ({ app, passport }) => {
  passport.use(facebookStrategy);

  app.get(route, passport.authenticate(PROVIDER, { scope: FACEBOOK_SCOPE }));
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

export default facebook;
