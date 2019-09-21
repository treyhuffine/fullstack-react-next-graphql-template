import * as React from 'react';
import { NextPage } from 'next';
import withApolloClient from 'utils/withApolloClient';

const SetUsernamePage: NextPage = () => (
  <>
    <div>Let people set their username</div>
  </>
);

export default withApolloClient(SetUsernamePage);
