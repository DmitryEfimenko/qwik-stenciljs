## Qwik + Stencil SSR - Demo of the issue

For the purposes of the demo, a locally-build StencilJS lib is used. The Qwik app uses copied Stencil runtime files from `stencil-js-lib` outputs to avoid difficulties associated with `npm link`.

The issue is described on the running Qwik page and the Github issue.

## To run locally

### Build Stencil assets
```sh
cd stencil-js-lib
npm i
npm run build
```

### Run Qwik app
```sh
cd ../qwik-app
npm i
npm run preview
```

`dev`, `build`, and `preview` automatically run `sync:stencil-assets`, which copies
files with `qwik-app/scripts/sync-stencil-assets.ts`.

The sync script copies:
1. `../stencil-js-lib/dist/esm` -> `qwik-app/public/stencil-runtime/esm`
2. `../stencil-js-lib/hydrate` -> `qwik-app/public/stencil-runtime/hydrate`

## Preview

Use of `dev` does not work due to the need to have access to the manifest via `import { manifest } from '@qwik-client-manifest';`. So use `preview`. Maybe that can somehow be improved as well, but not a priority.

```sh
npm run preview
```

Preview runs on port `4173` (`--strictPort`).

## How the demo works

1. Client-side web components load from `/stencil-runtime/esm/loader.js`.
2. Stencil lazy chunks load from `/stencil-runtime/esm/*.js`.
3. SSR demo rendering uses copied hydrate runtime files from `public/stencil-runtime/hydrate`.

## When you change Stencil components

```sh
cd stencil-js-lib
npm run build

cd ../qwik-app
npm run preview
```

The Qwik scripts will resync copied assets automatically.
