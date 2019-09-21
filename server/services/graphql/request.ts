import fetch from 'node-fetch';
import { getGraphqlServerUri } from './constants';

const GRAPHQL_URI = getGraphqlServerUri();

const headers = {
  'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
};

export const graphqlRequest = async ({
  query,
  variables,
}: {
  query: string;
  variables?: object;
}) => {
  try {
    const res = await fetch(GRAPHQL_URI, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      headers,
    });

    // Log graphql errors

    return res;
  } catch (error) {
    // log in sentry?
    throw error;
  }
};
