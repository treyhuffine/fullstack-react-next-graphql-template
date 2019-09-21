declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }

  interface Global {
    fetch: any;
    atob: any;
  }
}

declare const window;
declare const atob;

declare module '*.svg';
