import styled from 'styled-components';

export const ModalContent = styled.div`
  text-align: center;
  padding-top: 16px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const Header = styled.h1`
  font-weight: 500;
`;

export const Description = styled.p``;

export const Disclaimer = styled.p`
  color: ${props => props.theme.color.textSecondary};
  font-weight: 300;
  font-size: 12px;
  margin-top: 24px;
  margin-bottom: 0;
`;

export const ButtonWrapper = styled.div`
  margin-top: 20px;
`;
