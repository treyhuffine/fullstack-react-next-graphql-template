import styled from 'styled-components';

const POINTER_DIMENSIONS = 16;
const DEFAULT_WIDTH = 360;

interface ContentProps {
  width?: number;
}
export const Content = styled.div<ContentProps>`
  background-color: ${props => props.theme.color.backgroundDistinct};
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border: 1px solid ${props => props.theme.color.border};
  position: absolute;
  top: calc(100% + ${POINTER_DIMENSIONS}px);
  padding: 12px;
  display: block;
  white-space: pre-line;
  width: ${({ width }) => (width ? width : DEFAULT_WIDTH)}px;

  &:after {
    background-color: ${props => props.theme.color.backgroundDistinct};
    border-top: 1px solid ${props => props.theme.color.border};
    border-left: 1px solid ${props => props.theme.color.border};
    display: block;
    position: absolute;
    pointer-events: none;
    content: '';
    visibility: visible;
    transform: rotate(45deg);
    width: ${POINTER_DIMENSIONS}px;
    height: ${POINTER_DIMENSIONS}px;
    box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.5);
    z-index: 2;
    top: -9px;
    left: 50%;
    margin: 0 0 0 -8px;
  }
`;
