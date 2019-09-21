declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }

  interface Global {
    fetch: any;
  }
}

declare module '*.svg';
