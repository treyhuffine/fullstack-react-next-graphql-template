import * as React from 'react';
import { createPortal } from 'react-dom';
import { KeyCodes, isLastChild, hasChildren, freezeBody, unfreezeBody } from 'utils/dom';
import noop from 'utils/noop';
import { MODAL_ID } from 'utils/constants';

interface Props {
  onClose: (event: any) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

const Portal: React.FC<Props> = ({ children, onClose = noop, modalRef }) => {
  const modalRoot = document.getElementById(MODAL_ID);
  const el = document.createElement('div');

  const onKeyDown = (event: any) => {
    if (event.keyCode === KeyCodes.Esc) {
      onClose(event);
    }
  };

  const onMouseDown = (event: any) => {
    if (modalRef) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isLastChild(el)) {
        onClose(event);
        event.stopImmediatePropagation();
      }
    }
  };

  React.useEffect(() => {
    if (modalRoot) {
      modalRoot.appendChild(el);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);

    freezeBody();

    return () => {
      if (modalRoot) {
        modalRoot.removeChild(el);
      }

      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);

      if (!hasChildren(modalRoot)) {
        unfreezeBody();
      }
    };
  }, []);

  return createPortal(children, el);
};

export default Portal;
