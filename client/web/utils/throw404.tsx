import NextError from 'next/error';

interface NextErrorObject extends Error {
  code?: string;
}

export const NOT_FOUND_MESSAGE = 'ENOENT';
export const NOT_FOUND_STATUS = 404;
export default function throw404() {
  if (process.browser) {
    // Receiving TS errors for nested extended React.Component children
    // @ts-ignore JSX element class does not support attributes because it does not have a 'props' property.ts(2607)
    return <NextError statusCode={NOT_FOUND_STATUS} />;
  }

  const e: NextErrorObject = new Error('Not found');
  e.code = NOT_FOUND_MESSAGE;
  throw e;
}
