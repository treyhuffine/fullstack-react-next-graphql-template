import * as React from 'react';
import { NextPageContext, NextPage } from 'next';
// import App from 'next/app';
import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import Head from 'next/head';
import { getToken, getAuthHeaderFromToken } from 'utils/auth';
import { MODAL_ID } from 'utils/constants';
import { getViewerFromToken, Viewer } from '@appname/utils/auth';
import ThemeProvider from 'components/ThemeProvider';
import ViewerProvider from 'components/context/ViewerProvider';
import initApollo, { InitApolloOptions } from './initApollo';
import { NOT_FOUND_MESSAGE } from './throw404';

// NOTE: For some reason TS is not recognizing that App extends React.Component. ignoring in places in file

interface ExtendedProps {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

interface WithApolloProps {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  apolloState: any;
  initApolloOptions: InitApolloOptions;
  displayName: string;
}

type WithApolloClient = (
  PageComponent: NextPage<any, any>,
  options?: { ssr?: boolean },
) => React.FC<any>;

let viewer: Viewer = { id: '' };

const getViewer = (authToken: string = '') => {
  if (typeof window === 'undefined') {
    return getViewerFromToken(authToken);
  }

  // Reuse client on the client-side
  if (!viewer.id) {
    viewer = getViewerFromToken(authToken);
  }

  return viewer;
};

const withApolloClient: WithApolloClient = (PageComponent, options = {}) => {
  const { ssr = true } = options;

  const WithApollo: React.FC<WithApolloProps> = ({
    apolloClient,
    apolloState,
    initApolloOptions,
    ...pageProps
  }) => {
    const client = React.useMemo(
      () => apolloClient || initApollo(apolloState, initApolloOptions),
      [],
    );
    viewer = getViewer(initApolloOptions.authToken);

    return (
      <>
        <ApolloProvider client={client}>
          <ViewerProvider viewer={viewer}>
            <ThemeProvider>
              {/*
               // @ts-ignore JSX element type 'AppComponent' does not have any construct or call signatures. */}
              <PageComponent {...pageProps} />
            </ThemeProvider>
          </ViewerProvider>
        </ApolloProvider>
        <div id={MODAL_ID} />
      </>
    );
  };

  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore displayName, name do not exist
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    // @ts-ignore Property 'getInitialProps'
    WithApollo.getInitialProps = async (ctx: NextPageContext & ExtendedProps) => {
      const { AppTree } = ctx;

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const initApolloOptions: InitApolloOptions = {
        headers: {},
      };
      const authToken = getToken(ctx);
      initApolloOptions.authToken = authToken;
      const authHeader = getAuthHeaderFromToken(authToken);
      if (authHeader) {
        initApolloOptions.headers!.Authorization = authHeader;
      }
      const apolloClient = (ctx.apolloClient = initApollo(undefined, initApolloOptions));

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              // @ts-ignore Type '{ pageProps: { apolloClient: any; }; }' is missing
              <AppTree
                pageProps={{
                  ...pageProps,
                  initApolloOptions,
                  apolloClient,
                }}
              />,
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
            if (error.code === NOT_FOUND_MESSAGE) {
              throw error;
            }
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        initApolloOptions,
        apolloState,
      };
    };
  }

  return WithApollo;
};

export default withApolloClient;
