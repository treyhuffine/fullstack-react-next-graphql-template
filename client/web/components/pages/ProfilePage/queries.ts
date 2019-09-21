import { gql } from 'apollo-boost';

export const GET_PROFILE_USER = gql`
  query GetProfileUser($username: String) {
    userProfile(where: { username: { _eq: $username } }, limit: 1, distinct_on: username) {
      bio
      headline
      displayName
      twitterUrl
      profileImage
      username
      website
    }
  }
`;
