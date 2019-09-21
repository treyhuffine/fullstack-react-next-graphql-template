import { Request } from 'express';
import { Profile } from 'passport';

export interface AuthRequestPayload {
  request: Request;
  profileResponse: Profile;
  accessToken: string;
  accessTokenSecret?: string;
  refreshToken?: string;
}

export type OAuthRequest = (payload: AuthRequestPayload) => Promise<any>;
