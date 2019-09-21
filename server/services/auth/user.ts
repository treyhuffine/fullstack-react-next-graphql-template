import uuid from 'uuid/v4';
import slugify from 'slugify';
import { UserMutation } from '../graphql/constants';

const addNameSalt = () => uuid().slice(0, 4);
export const generateUsername = displayName =>
  slugify(`${displayName}-${addNameSalt()}`, {
    lower: true,
    replacement: '-',
  });

export const extractUserFromAuthMutation = (graphqlResponse: any, action: UserMutation) => {
  try {
    return graphqlResponse.data[action].returning[0];
  } catch (error) {
    return null;
  }
};

export const extractUserFromAuthQuery = (graphqlResponse: any) => {
  try {
    return graphqlResponse.data.user[0];
  } catch (error) {
    return null;
  }
};
