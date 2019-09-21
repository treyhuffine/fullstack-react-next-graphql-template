import * as React from 'react';
import CompanyButton from 'components/Button/CompanyButton';
import Modal from 'components/Modal';
import { Company } from 'style/company';

import { ModalContent, Header, Disclaimer, Description, ButtonWrapper } from './styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalContent>
        <Header>Sign Up or Sign In</Header>
        <Description>Join thousands of others</Description>
        <ButtonWrapper>
          <CompanyButton company={Company.Facebook}>Facebook</CompanyButton>
        </ButtonWrapper>
        <ButtonWrapper>
          <CompanyButton company={Company.Google}>Google</CompanyButton>
        </ButtonWrapper>
        <ButtonWrapper>
          <CompanyButton company={Company.Twitter}>Twitter</CompanyButton>
        </ButtonWrapper>
        <ButtonWrapper />
        <Disclaimer>
          We use social network authentication to prevent spam. We will never post on your accounts
          or message your friends.
        </Disclaimer>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
