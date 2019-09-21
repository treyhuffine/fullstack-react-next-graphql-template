import * as React from 'react';

import { StyledButton } from './styles';

interface Props {
  content?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: React.FC<Props> = ({ content, onClick, className, children }) => (
  <StyledButton onClick={onClick} className={className}>
    {content}
    {children}
  </StyledButton>
);

export default Button;
