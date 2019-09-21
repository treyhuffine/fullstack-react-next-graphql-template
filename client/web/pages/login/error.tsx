import * as React from 'react';
import { NextPage } from 'next';

const LoginErrorPage: NextPage = () => (
  <div>
    There was an error logging in. Make sure you accepted permissions correctly. Try again or use a
    different provider. If you continue to have trouble please email us at...
  </div>
);

export default LoginErrorPage;
