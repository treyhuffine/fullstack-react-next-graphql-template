import * as React from 'react';
import Link from 'next/link';

import { Wrapper, Container } from './styles';

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <Wrapper>
      <Container>App ©{year} - ∞</Container>
      <div>
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </Wrapper>
  );
};

export default Footer;
