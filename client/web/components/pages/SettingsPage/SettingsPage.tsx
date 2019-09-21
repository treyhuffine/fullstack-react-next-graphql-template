import * as React from 'react';
import PageLayoutDefault from 'components/PageLayout/Default';

const SettingsPage: React.FC = () => {
  return (
    <PageLayoutDefault hideFooter>
      <Wrapper>
        <div>User's profile page</div>
      </Wrapper>
    </PageLayoutDefault>
  );
};

export default SettingsPage;
