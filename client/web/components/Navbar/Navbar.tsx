import * as React from 'react';
import Link from 'next/link';
import AuthModal from 'components/AuthModal';

import { Header, Section, NavIcon } from './styles';

interface Props {
  isAuthenticated?: boolean;
}

// const Navbar: React.FC<Props> = ({ isAuthenticated = false }) => {
const Navbar: React.FC<Props> = ({ isAuthenticated = false }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const openAuthModal = React.useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = React.useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <>
      <Header style={{ zIndex: 1 }}>
        <Section className="logo" style={{ fontWeight: 'bold' }}>
          <Link href="/">
            <a>APP NAME</a>
          </Link>
        </Section>
        <Section>
          {isAuthenticated ? <div>user avatar dropdown</div> : <NavIcon onClick={openAuthModal} />}
        </Section>
      </Header>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
};

export default Navbar;
