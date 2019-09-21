import styled from 'styled-components';

export const Layout = styled.div`
  min-height: 100vh;
`;

export const Content: any = styled.div`
  flex-grow: 1;
  background-color: ${({ theme }: { theme: any }) => theme.color.background};
  padding: ${({ removeGutter }: { removeGutter: boolean }) => (removeGutter ? '0' : '0 48px')};
`;
