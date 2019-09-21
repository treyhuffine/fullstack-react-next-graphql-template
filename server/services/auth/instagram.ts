import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';
import { getViewerFromToken } from '@appname/utils/auth';
import { graphqlRequest } from '../graphql/request';
import { UserMutation } from '../graphql/constants';
import { getAuthToken, tokenContainsViewer } from './jwt';
import { generateUsername, extractUserFromAuthMutation } from './user';
import { OAuthRequest } from './types';

export const SET_USER_INSTAGRAM_CREDENTIALS = gql`
  mutation UpdateInstagramUserToken(
    $id: uuid
    $instagramId: String
    $instagramToken: String
    $instagramRefreshToken: String
    $instagramUsername: String
    $instagramUrl: String
  ) {
    update_user(
      where: { id: { _eq: $id } }
      _set: {
        instagramId: $instagramId
        instagramToken: $instagramToken
        instagramRefreshToken: $instagramRefreshToken
        instagramUsername: $instagramUsername
        instagramUrl: $instagramUrl
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const setUserInstagramCredentials = print(SET_USER_INSTAGRAM_CREDENTIALS);

const mapInstagramResponseToUser = ({ profileResponse, accessToken, refreshToken }) => {
  const { id, username, name = {}, _json } = profileResponse;
  const { data = {} } = _json;
  const { profile_picture } = data;

  const user = {
    ...name,
    username: generateUsername(username),
    profileImage: profile_picture,
    instagramToken: accessToken,
    instagramRefreshToken: refreshToken,
    instagramId: id,
    instagramUsername: username,
    instagramUrl: `https://instagram.com/${username}`,
  };

  return user;
};

export const syncUserWithInstagram: OAuthRequest = async ({
  request,
  profileResponse,
  accessToken,
  refreshToken,
}) => {
  const authToken = getAuthToken(request.cookies);

  if (tokenContainsViewer(authToken)) {
    const viewer = getViewerFromToken(authToken);
    const {
      instagramId,
      instagramToken,
      instagramRefreshToken,
      instagramUsername,
      instagramUrl,
    } = mapInstagramResponseToUser({
      profileResponse,
      accessToken,
      refreshToken,
    });
    const variables = {
      id: viewer.id,
      instagramId,
      instagramToken,
      instagramRefreshToken,
      instagramUsername,
      instagramUrl,
    };
    const response = await graphqlRequest({ query: setUserInstagramCredentials, variables });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Update);

    return { user, errors: responseJson.errors };
  } else {
    return { errors: { message: 'You must be logged in to sync an instagram account' } };
  }
};
