import * as React from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

import { Layout, Content } from './styles';

interface Props {
  hideNav?: boolean;
  hideFooter?: boolean;
  removeGutter?: boolean;
}

const PageLayoutDefault: React.FC<Props> = ({
  children,
  hideNav,
  hideFooter,
  removeGutter = false,
}) => {
  return (
    <Layout className="layout">
      <Head>
        <title>App Name</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {!hideNav && <Navbar />}
      <Content removeGutter={removeGutter}>{children}</Content>
      {!hideFooter && <Footer />}
    </Layout>
  );
};

export default PageLayoutDefault;
