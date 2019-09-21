import { Request, Response, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { Role } from '@appname/utils/types/data/user';
import { getViewerFromToken } from '@appname/utils/auth';
import { HASURA_CLAIMS_KEY, HasuraClaimKey } from '@appname/utils/constants/auth';

const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const secure = NODE_ENV !== 'development';
const yearInSeconds = 60 * 60 * 24 * 365;
let domain = '';
if (process.env.NODE_ENV === 'production') {
  domain = 'example.com';
} else if (process.env.NODE_ENV === 'stage') {
  domain = 'stage.example.com ';
}

interface HasuraClaims {
  [HasuraClaimKey.AllowedRoles]: string[];
  [HasuraClaimKey.DefaultRole]: string;
  [HasuraClaimKey.UserID]: string;
}

export interface SessionToken {
  tokenId: string;
  sub: string;
  iat: number;
  exp: number;
  [HASURA_CLAIMS_KEY]: HasuraClaims;
  admin?: boolean;
}

export const cookieOptions: CookieOptions = {
  maxAge: yearInSeconds * 1000,
  secure,
  httpOnly: false, //  TODO: Find a way to make this work?
  sameSite: false,
  path: '/',
  domain,
};

const buildHasuraClaims = user => {
  return {
    [HasuraClaimKey.AllowedRoles]: [Role.User, Role.Public],
    [HasuraClaimKey.DefaultRole]: Role.User,
    [HasuraClaimKey.UserID]: user.id,
  };
};

const createUserSession = user => {
  const iat = Math.floor(Date.now() / 1000);

  const sessionToken: SessionToken = {
    tokenId: uuid(),
    sub: user.id,
    iat,
    exp: iat + yearInSeconds,
    [HASURA_CLAIMS_KEY]: buildHasuraClaims(user),
  };

  if (user.admin) {
    sessionToken.admin = true;
    sessionToken[HASURA_CLAIMS_KEY][HasuraClaimKey.DefaultRole] = Role.Admin;
    sessionToken[HASURA_CLAIMS_KEY][HasuraClaimKey.AllowedRoles].push(Role.Admin);
  }

  const token = jwt.sign(sessionToken, JWT_SECRET);

  return token;
};

export const setAuthToken = (req: Request, res: Response) => {
  if (req.user) {
    const token = createUserSession(req.user);
    res.cookie(process.env.JWT_TOKEN_NAME, token, cookieOptions);
  }

  return req.user;
};

export const getAuthToken = (cookies = {}) => {
  return cookies[process.env.JWT_TOKEN_NAME];
};

export const isValidToken = (token: string) => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

export const tokenContainsViewer = (token: string) => {
  const isValid = !!token && isValidToken(token);

  if (!isValid) {
    return false;
  }

  const viewer = getViewerFromToken(token);

  return !!viewer.id;
};
