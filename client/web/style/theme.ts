import company from 'style/company';

const COLOR_BRAND = '#1890ff';

const zIndex = {
  z1: 100,
  z2: 200,
  z3: 300,
  z4: 400,
  z5: 500,
  z6: 600,
  z7: 700,
  z8: 800,
  z9: 900,
  z10: 1000,
  nav: 900,
  modal: 1000,
};

const spacing = {
  gutter: 20,
  navHeight: 64,
  verticalPagePad: 32,
  articleWidth: 800,
};

export enum BasePalette {
  Red = '#FF695E',
  Orange = '#FF851B',
  Yellow = '#FFE21F',
  Green = '#2ECC40',
  Teal = '#6DFFFF',
  SkyBlue = '#54C8FF',
  Blue = '#2185D0',
  Violet = '#806de4',
  Purple = '#DC73FF',
  Pink = '#FF8EDF',
  Brown = '#D67C1C',
  Black = '#000000',
}

export enum ScrollerPalette {
  Introduction = BasePalette.Blue,
  Traps = BasePalette.Red,
  Hints = BasePalette.Violet,
  Solution = BasePalette.Green,
  Progress = BasePalette.Orange,
}

export interface ThemeType {
  color: {
    background: string;
    backgroundSecondary: string;
    backgroundDistinct: string;
    navBackground: string;
    lightShadow: string;
    darkShadow: string;
    tileBorder: string;
    textPrimary: string;
    textSecondary: string;
    textLight: string;
    inverted: string;
    brand: string;
    cta: string;
    border: string;
    overlay: string;
  };
  spacing: typeof spacing;
  zIndex: typeof zIndex;
  company: typeof company;
}

export const themeDark: ThemeType = {
  color: {
    background: '#272727',
    backgroundSecondary: '#393C3E',
    backgroundDistinct: '#393C3E',
    navBackground: '#393C3E',
    lightShadow: '#525252',
    darkShadow: 'rgba(30, 30, 30, 0.6)',
    tileBorder: '#272727',
    textPrimary: '#FFFFFF',
    textSecondary: '#BFBEBE',
    textLight: '#9f9f9f',
    inverted: '#000000',
    brand: COLOR_BRAND,
    cta: BasePalette.Green,
    border: '#525252',
    overlay: '#000000',
  },
  spacing,
  zIndex,
  company,
};

export const themeLight: ThemeType = {
  color: {
    background: '#FFFFFF',
    backgroundSecondary: '#F0F2F5',
    backgroundDistinct: '#393C3E',
    navBackground: '#FFFFFF',
    lightShadow: '#525252',
    darkShadow: 'rgba(20,23,28,0.1)',
    tileBorder: '#272727',
    textPrimary: 'rgba(0, 0, 0, 0.65)',
    textSecondary: '#555555',
    textLight: '#9f9f9f',
    inverted: '#FFFFFF',
    brand: COLOR_BRAND,
    cta: BasePalette.Green,
    border: '#C1C0C0',
    overlay: '#FFFFFF',
  },
  spacing,
  zIndex,
  company,
};
