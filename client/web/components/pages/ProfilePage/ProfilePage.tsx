import * as React from 'react';
import PageLayoutDefault from 'components/PageLayout/Default';
import { ContentWrapper } from 'style/elements';

const ProfilePage: React.FC<any> = () => {
  return (
    <PageLayoutDefault>
      <div>Cover photo?</div>
      <ContentWrapper>
        <div>This is a user's profile</div>
      </ContentWrapper>
    </PageLayoutDefault>
  );
};

export default ProfilePage;
