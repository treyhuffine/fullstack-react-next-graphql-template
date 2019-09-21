import styled from 'styled-components';
import { RawButton } from 'style/elements';
import { mobile } from 'style/breakpoints';

const DEFAULT_WIDTH = 400;

interface ModalProps {
  maxWidth?: string;
  maxHeight?: string;
}

export const ModalWrapper = styled.div<ModalProps>`
  overflow: scroll;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: ${props => (props.maxWidth ? props.maxWidth : `${DEFAULT_WIDTH}px`)};
  max-height: ${props => (props.maxHeight ? props.maxHeight : 'calc(100% - 64px)')};
  background-color: ${props => props.theme.color.background};
  -webkit-overflow-scrolling: touch;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.7), 0px 1px 1px 0px rgba(0, 0, 0, 0.54),
    0px 2px 1px 0px rgba(0, 0, 0, 0.52);

  ${mobile()} {
    width: 100vw;
    height: 100vh;
    max-height: 100%;
    max-width: 100%;
  }
`;

export const ModalContent = styled.div`
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const CloseButtonWrapper = styled.div`
  position: relative;
`;

export const CloseButton = styled(RawButton)`
  color: ${props => props.theme.color.textPrimary};
  font-size: 36px;
  position: fixed;
  top: 9px;
  right: 22px;
  padding: 0;
`;
