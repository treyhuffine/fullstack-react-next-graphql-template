import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';
import { AuthSource, Role } from '@appname/utils/types/data/user';
import { getViewerFromToken } from '@appname/utils/auth';
import { graphqlRequest } from '../graphql/request';
import { UserMutation } from '../graphql/constants';
import { getAuthToken, tokenContainsViewer } from './jwt';
import { generateUsername, extractUserFromAuthMutation, extractUserFromAuthQuery } from './user';
import { OAuthRequest } from './types';

export const CREATE_GOOGLE_USER_MUTATION = gql`
  mutation CreateGoogleUser(
    $googleId: String
    $googleToken: String
    $googleRefreshToken: String
    $displayName: String
    $email: String
    $givenName: String
    $familyName: String
    $middleName: String
    $profileImage: String
    $username: String
    $registrationSource: String
    $locale: String
    $role: String
  ) {
    insert_user(
      objects: {
        googleId: $googleId
        googleToken: $googleToken
        googleRefreshToken: $googleRefreshToken
        displayName: $displayName
        email: $email
        givenName: $givenName
        familyName: $familyName
        middleName: $middleName
        profileImage: $profileImage
        username: $username
        registrationSource: $registrationSource
        locale: $locale
        role: $role
      }
      on_conflict: {
        constraint: user_email_key
        update_columns: [googleToken, googleId, googleRefreshToken, locale]
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const GET_USER_BY_GOOGLE_ID = gql`
  query GetUserByGoogleID($googleId: String) {
    user(where: { googleId: { _eq: $googleId } }, limit: 1, distinct_on: googleId) {
      googleId
    }
  }
`;

export const SET_USER_GOOGLE_CREDENTIALS = gql`
  mutation UpdateGoogleUserToken(
    $id: uuid
    $googleId: String
    $googleToken: String
    $googleRefreshToken: String
  ) {
    update_user(
      where: { id: { _eq: $id } }
      _set: {
        googleId: $googleId
        googleToken: $googleToken
        googleRefreshToken: $googleRefreshToken
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const UPDATE_USER_GOOGLE_TOKEN = gql`
  mutation UpdateGoogleUserToken(
    $googleId: String
    $googleToken: String
    $googleRefreshToken: String
  ) {
    update_user(
      where: { googleId: { _eq: $googleId } }
      _set: { googleToken: $googleToken, googleRefreshToken: $googleRefreshToken }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const createGoogleUserMutation = print(CREATE_GOOGLE_USER_MUTATION);
export const getUserByGoogleId = print(GET_USER_BY_GOOGLE_ID);
export const setUserGoogleCredentials = print(SET_USER_GOOGLE_CREDENTIALS);
export const updateUserGoogleToken = print(UPDATE_USER_GOOGLE_TOKEN);

const mapGoogleResponseToUser = ({ profileResponse, accessToken, refreshToken }) => {
  const { id, displayName, name = {}, photos, _json } = profileResponse;
  const { email, locale } = _json;
  let profileImage;

  try {
    profileImage = photos[0].value.replace('_normal', '_400x400');
  } catch (error) {}

  const user = {
    ...name,
    username: generateUsername(displayName),
    displayName,
    email,
    profileImage,
    googleToken: accessToken,
    googleRefreshToken: refreshToken,
    googleId: id,
    registrationSource: AuthSource.Google,
    locale,
    role: Role.User,
  };

  return user;
};

export const createOrUpdateGoogleUser: OAuthRequest = async ({
  request,
  profileResponse,
  accessToken,
  refreshToken,
}) => {
  const authToken = getAuthToken(request.cookies);

  if (tokenContainsViewer(authToken)) {
    const viewer = getViewerFromToken(authToken);
    const { googleId, googleToken, googleRefreshToken } = mapGoogleResponseToUser({
      profileResponse,
      accessToken,
      refreshToken,
    });
    const variables = {
      id: viewer.id,
      googleId,
      googleToken,
      googleRefreshToken,
    };
    const response = await graphqlRequest({ query: setUserGoogleCredentials, variables });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Update);

    return { user, errors: responseJson.errors };
  }

  const variables = mapGoogleResponseToUser({ profileResponse, accessToken, refreshToken });
  const existingUserResponse = await graphqlRequest({
    query: getUserByGoogleId,
    variables: { googleId: variables.googleId },
  });
  const existingUserJson = await existingUserResponse.json();
  const existingUser = extractUserFromAuthQuery(existingUserJson);

  if (existingUser) {
    const { googleId, googleToken, googleRefreshToken } = variables;
    const response = await graphqlRequest({
      query: updateUserGoogleToken,
      variables: { googleId, googleToken, googleRefreshToken },
    });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Update);

    return { user, errors: responseJson.errors };
  } else {
    const response = await graphqlRequest({ query: createGoogleUserMutation, variables });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Insert);

    return { user, errors: responseJson.errors };
  }
};
