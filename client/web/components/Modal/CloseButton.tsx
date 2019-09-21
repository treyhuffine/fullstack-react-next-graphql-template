import * as React from 'react';

import { CloseButtonWrapper, CloseButton as Button } from './styles';

interface Props {
  onClose: (e: any) => void;
}

const CloseButton: React.FC<Props> = ({ onClose }) => (
  <CloseButtonWrapper onClick={onClose}>
    <Button>&times;</Button>
  </CloseButtonWrapper>
);

export default CloseButton;
