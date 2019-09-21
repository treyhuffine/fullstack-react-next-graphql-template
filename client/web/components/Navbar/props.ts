import { ApolloError } from 'apollo-boost';
// import { GetViewerQuery } from 'types/generated/graphql';

export interface Props {
  // data?: GetViewerQuery;
  loading: boolean;
  error?: ApolloError;
  isFixed?: boolean;
}
