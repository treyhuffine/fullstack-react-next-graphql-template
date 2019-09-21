import styled from 'styled-components';

export const Wrapper = styled.div<{ hoverable?: boolean }>`
  border: 1px solid ${props => props.theme.color.border};
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  transition: border 0.2s ease;

  &:hover {
    ${props => props.hoverable && `border: 1px solid ${props.theme.color.textPrimary};`}
  }
`;

export const Content = styled.div`
  padding: 12px;
`;
