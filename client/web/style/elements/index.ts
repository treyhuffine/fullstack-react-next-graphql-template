import styled from 'styled-components';

export const MAX_CONTENT_WIDTH = 1000;

export const MaxWidthContainer = styled.div<{ padBottom?: boolean }>`
  max-width: ${MAX_CONTENT_WIDTH}px;
  margin: 0 auto;
  padding: 0 10px;
`;

export const ContentWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.verticalPagePad}px 0;
`;

export const RawButton = styled.button`
  display: inline-block;
  border: none;
  margin: 0;
  text-decoration: none;
  background: none;
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    outline: none;
  }

  &:focus {
    outline: none;
  }
`;
