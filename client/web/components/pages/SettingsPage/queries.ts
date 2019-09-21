import { gql } from 'apollo-boost';

export const GET_PROFILE_USER = gql`
  query GetUserSettings($id: uuid) {
    user(where: { id: { _eq: $id } }, limit: 1, distinct_on: id) {
      bio
      headline
      displayName
      twitterUrl
      profileImage
      id
      username
      website
    }
  }
`;
