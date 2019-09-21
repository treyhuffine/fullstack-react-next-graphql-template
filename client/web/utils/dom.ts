import { FREEZE_CLASS } from 'style/GlobalStyle';

export enum KeyCodes {
  Backspace = 8,
  Enter = 13,
  Esc = 27,
}

export const isLastChild = (el: HTMLDivElement) => !el.nextElementSibling;

export const hasChildren = (el: HTMLElement | null) => !!el && el.hasChildNodes();

export const freezeBody = () => {
  document.body.classList.add(FREEZE_CLASS);
};

export const unfreezeBody = () => {
  document.body.classList.remove(FREEZE_CLASS);
};
