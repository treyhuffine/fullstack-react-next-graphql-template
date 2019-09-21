import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';
import { AuthSource, Role } from '@appname/utils/types/data/user';
import { getViewerFromToken } from '@appname/utils/auth';
import { graphqlRequest } from '../graphql/request';
import { UserMutation } from '../graphql/constants';
import { getAuthToken, tokenContainsViewer } from './jwt';
import { generateUsername, extractUserFromAuthMutation, extractUserFromAuthQuery } from './user';
import { OAuthRequest } from './types';

export const CREATE_FACEBOOK_USER_MUTATION = gql`
  mutation CreateFacebookUser(
    $facebookId: String
    $facebookToken: String
    $facebookRefreshToken: String
    $displayName: String
    $email: String
    $givenName: String
    $familyName: String
    $middleName: String
    $profileImage: String
    $username: String
    $gender: String
    $birthday: String
    $registrationSource: String
    $role: String
  ) {
    insert_user(
      objects: {
        facebookId: $facebookId
        facebookToken: $facebookToken
        facebookRefreshToken: $facebookRefreshToken
        displayName: $displayName
        email: $email
        givenName: $givenName
        familyName: $familyName
        middleName: $middleName
        profileImage: $profileImage
        username: $username
        gender: $gender
        birthday: $birthday
        registrationSource: $registrationSource
        role: $role
      }
      on_conflict: {
        constraint: user_email_key
        update_columns: [facebookToken, facebookId, facebookRefreshToken]
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const GET_USER_BY_FACEBOOK_ID = gql`
  query GetUserByFacebookID($facebookId: String) {
    user(where: { facebookId: { _eq: $facebookId } }, limit: 1, distinct_on: facebookId) {
      facebookId
    }
  }
`;

export const SET_USER_FACEBOOK_CREDENTIALS = gql`
  mutation UpdateFacebookUserToken(
    $id: uuid
    $facebookId: String
    $facebookToken: String
    $facebookRefreshToken: String
  ) {
    update_user(
      where: { id: { _eq: $id } }
      _set: {
        facebookId: $facebookId
        facebookToken: $facebookToken
        facebookRefreshToken: $facebookRefreshToken
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const UPDATE_USER_FACEBOOK_TOKEN = gql`
  mutation UpdateFacebookUserToken(
    $facebookId: String
    $facebookToken: String
    $facebookRefreshToken: String
  ) {
    update_user(
      where: { facebookId: { _eq: $facebookId } }
      _set: { facebookToken: $facebookToken, facebookRefreshToken: $facebookRefreshToken }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const createFacebookUserMutation = print(CREATE_FACEBOOK_USER_MUTATION);
export const getUserByFacebookId = print(GET_USER_BY_FACEBOOK_ID);
export const setUserFacebookCredentials = print(SET_USER_FACEBOOK_CREDENTIALS);
export const updateUserFacebookToken = print(UPDATE_USER_FACEBOOK_TOKEN);

const mapFacebookResponseToUser = ({ profileResponse, accessToken, refreshToken }) => {
  const { id, displayName, name = {}, gender, _json } = profileResponse;
  const { birthday, email } = _json;

  const user = {
    ...name,
    username: generateUsername(displayName),
    displayName,
    gender,
    birthday,
    email,
    profileImage: `https://graph.facebook.com/${id}/picture?type=large`,
    facebookToken: accessToken,
    facebookRefreshToken: refreshToken,
    facebookId: id,
    registrationSource: AuthSource.Facebook,
    role: Role.User,
  };

  return user;
};

export const createOrUpdateFacebookUser: OAuthRequest = async ({
  request,
  profileResponse,
  accessToken,
  refreshToken,
}) => {
  const authToken = getAuthToken(request.cookies);

  if (tokenContainsViewer(authToken)) {
    const viewer = getViewerFromToken(authToken);
    const { facebookId, facebookToken, facebookRefreshToken } = mapFacebookResponseToUser({
      profileResponse,
      accessToken,
      refreshToken,
    });
    const variables = {
      id: viewer.id,
      facebookId,
      facebookToken,
      facebookRefreshToken,
    };
    const response = await graphqlRequest({ query: setUserFacebookCredentials, variables });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Update);

    return { user, errors: responseJson.errors };
  }

  const variables = mapFacebookResponseToUser({ profileResponse, accessToken, refreshToken });
  const existingUserResponse = await graphqlRequest({
    query: getUserByFacebookId,
    variables: { facebookId: variables.facebookId },
  });
  const existingUserJson = await existingUserResponse.json();
  const existingUser = extractUserFromAuthQuery(existingUserJson);

  if (existingUser) {
    const { facebookId, facebookToken, facebookRefreshToken } = variables;
    const response = await graphqlRequest({
      query: updateUserFacebookToken,
      variables: { facebookId, facebookToken, facebookRefreshToken },
    });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Update);

    return { user, errors: responseJson.errors };
  } else {
    const response = await graphqlRequest({ query: createFacebookUserMutation, variables });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Insert);

    return { user, errors: responseJson.errors };
  }
};
