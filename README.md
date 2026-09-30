# restaurant-delivery-frontend

React + Vite + **urql** storefront for Bella Forchetta. Menu, cart and delivery checkout.

Typed GraphQL operations are **generated from the shared schema artifact**
(`@meeeeeeeeeeeeeeepo/restaurant-schema`, consumed from GitHub Packages) via
`@graphql-codegen/client-preset`, so the frontend and backend can never drift from the contract.

## Run locally

```bash
export NODE_AUTH_TOKEN=<GitHub token with packages:read>
npm ci
export VITE_API_URL=http://localhost:4000/graphql
npm run dev        # runs codegen then starts Vite on :5173
```

## Build

```bash
npm run build      # codegen + vite build -> dist/
```

## Deploy (Render)

`render.yaml` defines a **production** (`main`) and **staging** (`develop`) static site.
Set `NODE_AUTH_TOKEN` (packages:read) and `VITE_API_URL` (backend `/graphql`) per environment.
