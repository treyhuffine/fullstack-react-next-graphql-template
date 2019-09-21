import styled from 'styled-components';

const MENU_WIDTH = 336;
const MENU_GUTTER = 24;

export const Wrapper = styled.div`
  padding-top: 24px;
  display: flex;
`;

export const MenuWrapper = styled.div`
  width: ${MENU_WIDTH}px;
  min-width: ${MENU_WIDTH}px;
  margin-right: ${MENU_GUTTER}px;
`;

export const MenuFixed = styled.div`
  position: fixed;
`;

export const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${MENU_WIDTH - MENU_GUTTER}px;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
`;

export const Section = styled.div`
  margin-bottom: 28px;
`;

export const SocialLabel = styled.label`
  display: flex;
  align-items: center;
`;

export const CustomSVG = styled.img`
  margin-right: 4px;
  width: 14px;
  height: 14px;
`;
