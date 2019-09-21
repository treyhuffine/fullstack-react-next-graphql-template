const GraphQLServerURI = {
  development: 'http://localhost:8080/v1/graphql',
  staging: '',
  production: '',
};

export const getGraphqlServerUri = () => {
  return GraphQLServerURI[process.env.NODE_ENV];
};

export enum UserMutation {
  Insert = 'insert_user',
  Update = 'update_user',
}
