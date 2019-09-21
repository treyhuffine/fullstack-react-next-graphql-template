import * as http from 'http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';

export interface InitApolloOptions {
  clientState?: object;
  headers?: http.IncomingHttpHeaders;
  authToken?: string;
}

const URI = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/v1/graphql';
let apolloClient: ApolloClient<NormalizedCacheObject>;

// NOTE: Use Apollo Boost when it is more supported
function createApolloClient(initialState: any = {}, options: InitApolloOptions = {}) {
  const isServer = typeof window === 'undefined';

  const httpOptions = {
    uri: URI,
    fetch,
    credentials: 'same-origin',
    headers: {
      ...(options.headers || {}),
    },
  };

  const httpLink = createHttpLink(httpOptions);

  return new ApolloClient<NormalizedCacheObject>({
    connectToDevTools: !isServer,
    ssrMode: isServer, // Disables forceFetch on the server (so queries are only run once)
    link: httpLink,
    cache: new InMemoryCache().restore(initialState),
    // clientState, apollo-boost syntax for local state
  });
}

export default function initApollo(initialState: any = {}, options: InitApolloOptions = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState, options);
  }

  return apolloClient;
}
