import styled from 'styled-components';
import { RawButton } from 'style/elements';
import { CompanyButtonProps } from './props';

export const StyledButton = styled(RawButton)`
  padding: 1rem 2rem;
  background: #0069ed;
  color: #ffffff;
  transition: background-color 250ms ease-in-out;

  &:hover {
    background: #0053ba;
  }
`;

const CompanyButtonBase = styled(RawButton)`
  color: white;
  transition: background-color 250ms ease-in-out;
  width: 100%;
  padding: 14px;
  position: relative;
  font-weight: 600;
  border-radius: 2px;
`;

export const CompanyButtonWrapper = styled(CompanyButtonBase)<CompanyButtonProps>`
  background-color: ${props => props.theme.company.color[props.company]};

  &:hover {
    background-color: ${props => props.theme.company.hover[props.company]};
  }
`;

export const CompanyIcon = styled.i`
  position: absolute;
  left: 20px;
`;
