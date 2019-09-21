import * as React from 'react';
import { NextPage } from 'next';
import withApolloClient from 'utils/withApolloClient';
import ProfilePageContainer from 'components/pages/ProfilePage';

interface Props {
  username: string;
}

const ProfilePage: NextPage<Props> = ({ username }) => {
  return <ProfilePageContainer username={username} />;
};

ProfilePage.getInitialProps = async ({ query }) => {
  const { username } = query;
  return { username } as Props;
};

export default withApolloClient(ProfilePage);
