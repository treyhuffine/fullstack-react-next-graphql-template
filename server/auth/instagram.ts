import * as InstagramStrategy from 'passport-instagram';
import { AuthSource } from '@appname/utils/types/data/user';
import { syncUserWithInstagram } from '../services/auth/instagram';
import {
  buildAuthRoutes,
  FAILURE_ERROR_REDIRECT,
  LOGIN_SUCCESS_REDIRECT,
  OauthMiddlewareFunction,
  deleteOauthSession,
} from './oauth';

const PROVIDER = AuthSource.Instagram;
const { route, callback } = buildAuthRoutes(PROVIDER);
const INSTAGRAM_PROFILE_FIELDS = [
  'id',
  'displayName',
  'photos',
  'emails',
  'name',
  'counts',
  'website',
  'bio',
  'username',
];

const instagramStrategy = new InstagramStrategy.Strategy(
  {
    clientID: process.env.INSTAGRAM_CLIENT_ID!,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    callbackURL: callback,
    profileFields: INSTAGRAM_PROFILE_FIELDS,
    passReqToCallback: true,
  },
  async function(request, accessToken, refreshToken, profileResponse, done) {
    try {
      const { user, errors } = await syncUserWithInstagram({
        request,
        profileResponse,
        accessToken,
        refreshToken,
      });

      console.log('user, errors', user, errors);

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

const instagram: OauthMiddlewareFunction = ({ app, passport }) => {
  passport.use(instagramStrategy);

  app.get(route, passport.authenticate(PROVIDER));
  app.get(
    callback,
    passport.authenticate(PROVIDER, { failureRedirect: FAILURE_ERROR_REDIRECT }),
    (_req, res) => {
      // if username, redirect somewhere else, if not then take them to set username page

      deleteOauthSession(res);
      return res.redirect(true ? '/my/settings' : LOGIN_SUCCESS_REDIRECT);
    },
  );
};

export default instagram;
