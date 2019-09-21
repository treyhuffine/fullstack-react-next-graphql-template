import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';
import { AuthSource, Role } from '@appname/utils/types/data/user';
import { getViewerFromToken } from '@appname/utils/auth';
import { graphqlRequest } from '../graphql/request';
import { UserMutation } from '../graphql/constants';
import { getAuthToken, tokenContainsViewer } from './jwt';
import { generateUsername, extractUserFromAuthMutation, extractUserFromAuthQuery } from './user';
import { OAuthRequest } from './types';

export const CREATE_TWITTER_USER_MUTATION = gql`
  mutation CreateTwitterUser(
    $twitterId: String
    $twitterToken: String
    $twitterTokenSecret: String
    $twitterUsername: String
    $twitterUrl: String
    $displayName: String
    $email: String
    $givenName: String
    $familyName: String
    $middleName: String
    $profileImage: String
    $username: String
    $website: String
    $gender: String
    $birthday: String
    $registrationSource: String
    $role: String
  ) {
    insert_user(
      objects: {
        twitterId: $twitterId
        twitterToken: $twitterToken
        twitterTokenSecret: $twitterTokenSecret
        twitterUsername: $twitterUsername
        twitterUrl: $twitterUrl
        displayName: $displayName
        email: $email
        givenName: $givenName
        familyName: $familyName
        middleName: $middleName
        profileImage: $profileImage
        username: $username
        website: $website
        gender: $gender
        birthday: $birthday
        registrationSource: $registrationSource
        role: $role
      }
      on_conflict: {
        constraint: user_email_key
        update_columns: [twitterToken, twitterId, twitterTokenSecret, twitterUsername]
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const GET_USER_BY_TWITTER_ID = gql`
  query GetUserByTwitterID($twitterId: String) {
    user(where: { twitterId: { _eq: $twitterId } }, limit: 1, distinct_on: twitterId) {
      twitterId
    }
  }
`;

export const SET_USER_TWITTER_CREDENTIALS = gql`
  mutation UpdateTwitterUserToken(
    $id: uuid
    $twitterId: String
    $twitterToken: String
    $twitterTokenSecret: String
    $twitterUsername: String
  ) {
    update_user(
      where: { id: { _eq: $id } }
      _set: {
        twitterId: $twitterId
        twitterToken: $twitterToken
        twitterTokenSecret: $twitterTokenSecret
        twitterUsername: $twitterUsername
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const UPDATE_USER_TWITTER_TOKEN = gql`
  mutation UpdateTwitterUserToken(
    $twitterId: String
    $twitterToken: String
    $twitterTokenSecret: String
    $twitterUsername: String
  ) {
    update_user(
      where: { twitterId: { _eq: $twitterId } }
      _set: {
        twitterToken: $twitterToken
        twitterTokenSecret: $twitterTokenSecret
        twitterUsername: $twitterUsername
      }
    ) {
      returning {
        id
        admin
      }
    }
  }
`;

export const createTwitterUserMutation = print(CREATE_TWITTER_USER_MUTATION);
export const getUserByTwitterId = print(GET_USER_BY_TWITTER_ID);
export const setUserTwitterCredentials = print(SET_USER_TWITTER_CREDENTIALS);
export const updateUserTwitterToken = print(UPDATE_USER_TWITTER_TOKEN);

const mapTwitterResponseToUser = ({ profileResponse, accessToken, accessTokenSecret }) => {
  const { id, displayName, username, name = {}, photos, _json } = profileResponse;
  const { entities, email } = _json;
  let website;
  let profileImage;

  try {
    const url = entities.url.urls[0].expanded_url;
    website = url;
  } catch (error) {}

  try {
    profileImage = photos[0].value.replace('_normal', '_400x400');
  } catch (error) {}

  const user = {
    ...name,
    username: generateUsername(username || displayName),
    displayName,
    website,
    email,
    profileImage,
    twitterToken: accessToken,
    twitterTokenSecret: accessTokenSecret,
    twitterId: id,
    twitterUsername: username,
    twitterUrl: `https://twitter.com/${username}`,
    registrationSource: AuthSource.Twitter,
    role: Role.User,
  };

  return user;
};

export const createOrUpdateTwitterUser: OAuthRequest = async ({
  request,
  profileResponse,
  accessToken,
  accessTokenSecret,
}) => {
  const authToken = getAuthToken(request.cookies);

  if (tokenContainsViewer(authToken)) {
    const viewer = getViewerFromToken(authToken);
    const {
      twitterId,
      twitterToken,
      twitterTokenSecret,
      twitterUsername,
    } = mapTwitterResponseToUser({
      profileResponse,
      accessToken,
      accessTokenSecret,
    });
    const variables = {
      id: viewer.id,
      twitterId,
      twitterToken,
      twitterTokenSecret,
      twitterUsername,
    };
    const response = await graphqlRequest({ query: setUserTwitterCredentials, variables });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Update);

    return { user, errors: responseJson.errors };
  }

  const variables = mapTwitterResponseToUser({ profileResponse, accessToken, accessTokenSecret });
  const existingUserResponse = await graphqlRequest({
    query: getUserByTwitterId,
    variables: { twitterId: variables.twitterId },
  });
  const existingUserJson = await existingUserResponse.json();
  const existingUser = extractUserFromAuthQuery(existingUserJson);

  if (existingUser) {
    const { twitterId, twitterToken, twitterTokenSecret, twitterUsername } = variables;
    const response = await graphqlRequest({
      query: updateUserTwitterToken,
      variables: { twitterId, twitterToken, twitterTokenSecret, twitterUsername },
    });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Update);

    return { user, errors: responseJson.errors };
  } else {
    const response = await graphqlRequest({ query: createTwitterUserMutation, variables });
    const responseJson = await response.json();
    const user = extractUserFromAuthMutation(responseJson, UserMutation.Insert);

    return { user, errors: responseJson.errors };
  }
};
