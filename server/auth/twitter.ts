import * as TwitterStragtegy from 'passport-twitter';
import { AuthSource } from '@appname/utils/types/data/user';
import { createOrUpdateTwitterUser } from '../services/auth/twitter';
import { setAuthToken } from '../services/auth/jwt';
import {
  buildAuthRoutes,
  FAILURE_ERROR_REDIRECT,
  REGISTER_SUCCESS_REDIRECT,
  LOGIN_SUCCESS_REDIRECT,
  OauthMiddlewareFunction,
  deleteOauthSession,
} from './oauth';

const PROVIDER = AuthSource.Twitter;
const { route, callback } = buildAuthRoutes(PROVIDER);

// @ts-ignore package is super outdated
const twitterStrategy = new TwitterStragtegy.Strategy(
  {
    consumerKey: process.env.TWITTER_CLIENT_ID!,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
    callbackURL: callback,
    passReqToCallback: true,
    includeEmail: true,
    // @ts-ignore types are not updated
    includeStatus: false,
  },
  async function(request, accessToken, accessTokenSecret, profileResponse, done) {
    try {
      const { user, errors } = await createOrUpdateTwitterUser({
        request,
        profileResponse,
        accessToken,
        accessTokenSecret,
      });

      if (errors || !user) {
        const message = errors ? errors.message : 'User not found';
        console.log('--- ERROR message', message);
        // LOG SENTRY
        // @ts-ignore outdated?
        return done(null, false, message);
      }

      return done(null, user);
    } catch (error) {
      console.log('--- ERROR', error);
      return done(error, null);
    }
  },
);

const twitter: OauthMiddlewareFunction = ({ app, passport }) => {
  passport.use(twitterStrategy);

  app.get(route, passport.authenticate(PROVIDER));
  app.get(
    callback,
    passport.authenticate(PROVIDER, { failureRedirect: FAILURE_ERROR_REDIRECT }),
    (req, res) => {
      setAuthToken(req, res);
      deleteOauthSession(res);
      return res.redirect(true ? REGISTER_SUCCESS_REDIRECT : LOGIN_SUCCESS_REDIRECT);
    },
  );
};

export default twitter;
