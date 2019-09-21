import * as React from 'react';
import PageLayoutDefault from 'components/PageLayout/Default';
import { ContentWrapper } from 'style/elements';

const FeedPage: React.FC = () => {
  return (
    <PageLayoutDefault>
      <ContentWrapper>
        <div>This is the feed and/or landing page</div>
      </ContentWrapper>
    </PageLayoutDefault>
  );
};

export default FeedPage;
