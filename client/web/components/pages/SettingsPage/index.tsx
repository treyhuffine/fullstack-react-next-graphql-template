import * as React from 'react';
import SettingsPage from './SettingsPage';

const SettingsPageContainer: React.FC = () => {
  // NOTE: Leaving this code commented as a template

  // const viewer = React.useContext(ViewerContext);

  // if (!viewer.id) {
  //   Router.push('/');
  //   return null;
  // }

  // const { data, loading, error } = useGetUserSettingsQuery({
  //   variables: { id: viewer.id },
  // });

  // if (loading) return <div>Loading...</div>;
  // if (error) {
  //   // Handle error
  //   return <div>ERROR</div>;
  // }

  // const user = data && data.user[0];

  // if (!user) {
  //   Router.push('/');
  //   return null;
  // }

  return <SettingsPage />;
};

export default SettingsPageContainer;
