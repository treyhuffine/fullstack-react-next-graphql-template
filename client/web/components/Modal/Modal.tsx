import * as React from 'react';
import Portal from './Portal';
import ScreenWrapper from './ScreenWrapper';
import CloseButton from './CloseButton';

import { ModalWrapper, ModalContent } from './styles';

interface Props {
  isOpen: boolean;
  onClose: (event: any) => void;
  className?: string;
  useCloseButton?: boolean;
}

const Modal: React.FC<Props> = ({ children, isOpen, onClose, useCloseButton = true }) => {
  if (!process.browser || !isOpen) {
    return null;
  }

  const modalRef = React.useRef<HTMLDivElement>(null);

  return (
    <Portal onClose={onClose} modalRef={modalRef}>
      <ScreenWrapper isOpen={isOpen}>
        <div ref={modalRef}>
          <ModalWrapper>
            {useCloseButton && <CloseButton onClose={onClose} />}
            <ModalContent>{children}</ModalContent>
          </ModalWrapper>
        </div>
      </ScreenWrapper>
    </Portal>
  );
};

export default Modal;
