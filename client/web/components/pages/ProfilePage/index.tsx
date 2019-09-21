import * as React from 'react';
import ProfilePage from './ProfilePage';

interface Props {
  username: string;
}

const ProfilePageContainer: React.FC<Props> = () => {
  // NOTE: Leaving this code as a template

  // const { data, loading, error } = useGetProfileUserQuery({ variables: { username } });

  // if (loading) return <div>Loading...</div>;
  // if (error) {
  //   // Handle error
  //   return <div>ERROR</div>;
  // }

  // const userProfile = data && data.userProfile[0];

  // if (!userProfile) {
  //   return throw404();
  // }

  return <ProfilePage />;
};

export default ProfilePageContainer;
