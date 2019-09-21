import express from 'express';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import twitter from './twitter';
import facebook from './facebook';
import instagram from './instagram';
import google from './google';
import { PASSPORT_SESSION_CONFIG } from './oauth';

// Sentry.init({ dsn: '__PUBLIC_DSN__' });

const app = express();
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.errorHandler());

app.use(cookieParser());
app.use(session(PASSPORT_SESSION_CONFIG));
app.use(passport.initialize());
app.use(passport.session());

twitter({ app, passport });
facebook({ app, passport });
instagram({ app, passport });
google({ app, passport });

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

export default app;
