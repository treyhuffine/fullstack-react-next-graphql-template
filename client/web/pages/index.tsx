import { NextPage } from 'next';
import withApolloClient from 'utils/withApolloClient';
import FeedPage from 'components/pages/FeedPage';

export default withApolloClient(FeedPage as NextPage);
