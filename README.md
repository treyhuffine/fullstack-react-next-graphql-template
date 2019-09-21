# Fullstack React, GraphQL, CSS-in-JS App Template
This project uses yarn workspaces to manage it as a monorepo for a full stack React, GraphQL, CSS-in-JS app.

## Dev
You must have Docker and `now` installed on your machine.

To run your app:
```sh
cd graphql/dev
docker-componse up -d
cd
now dev
```

## Technologies
Client:
- React
- Styled Components for CSS-in-JS
- Next.js (SSR)
- Apollo (GraphQL)

Server:
- Hasura (GraphQL server)
- Zeit Now (creates Lambda functions)
- ./server/** contains the lambda functions. Currently there is a folder for auth, services, v1 (general REST API), and webhooks

TypeScript is used for the server lambda function because it keeps the language consistent across the stick and Node has a fast cold start time.

Use GraphQL Code Generator to generate TS types from the GraphQL server

## Environment Variables Needed
```
JWT_ALGORITHM
JWT_SECRET
HASURA_GRAPHQL_ADMIN_SECRET
EXPRESS_SESSION_SECRET
TWITTER_CLIENT_ID
TWITTER_CLIENT_SECRET
FACEBOOK_CLIENT_ID
FACEBOOK_CLIENT_SECRET
INSTAGRAM_CLIENT_ID
INSTAGRAM_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

## Todo
- Fix styles. Ant Design was gutted to make it more generic, and it needs to be fixed up.