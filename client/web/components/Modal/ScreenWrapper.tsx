import * as React from 'react';
import styled from 'styled-components';

import { rgba } from 'style/utils/color';

interface Props {
  isOpen: boolean;
}

const FullScreenWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${({ isOpen }) => (isOpen ? '100%' : 0)};
  width: ${({ isOpen }) => (isOpen ? '100%' : 0)};
  background-color: ${props =>
    props.isOpen ? rgba(props.theme.color.overlay, 0.7) : 'transparent'};
  transition: background-color 100ms ease-in-out;
  z-index: ${props => props.theme.zIndex.z10};
`;

const ScreenWrapper: React.FC<Props> = ({ isOpen, children }) => {
  return <FullScreenWrapper isOpen={isOpen}>{children}</FullScreenWrapper>;
};

export default ScreenWrapper;
