import * as React from 'react';
import { themeLight } from 'style/theme';
import { ThemeProvider } from 'styled-components';

const ThemeProviderWrapper = ({ children }: { children: any }) => {
  const theme = themeLight; // check props for theme

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
