import styled from 'styled-components';

export const Header = styled.header`
  box-shadow: 0 2px 8px #f0f1f2;
  z-index: ${({ theme }) => theme.zIndex.nav};
  background-color: ${({ theme }) => theme.color.background};
  display: flex;
  justify-content: space-between;

  a {
    color: rgba(0, 0, 0, 0.65);
    height: 100%;
    display: inline-flex;
  }
`;

export const Section = styled.div`
  display: flex;
  align-items: center;
`;

export const NavIcon = styled.i`
  font-size: 24px;
  cursor: pointer;
  margin-left: 16px;
`;
