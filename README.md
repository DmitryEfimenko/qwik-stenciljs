## Get Everything ready:

### StencilJS Lib:
```sh
cd stencil-js-lib
npm i
npm run build
npm link
```

### Qwik app
```sh
cd ../qwik-app
npm i
npm run link-stencil-lib
npm run preview
```

`qwik-app` scripts now sync local Stencil lazy chunks from
`../stencil-js-lib/dist/esm` into `qwik-app/public/stencil/esm` before `dev`,
`build`, and `preview`. This prevents preview 404s such as
`/build/de-button.entry.js` by loading chunks from `/stencil/esm/`.

Or run the link step directly:

```sh
npm link stencil-js-lib
```

Use the package name from `stencil-js-lib/package.json` in your imports:

```ts
import { defineCustomElements } from 'stencil-js-lib/loader';
```

## Linked Dev Troubleshooting

If Qwik dev/preview shows 403 for a request like:

`/@fs/C:/.../stencil-js-lib/dist/esm/de-button.entry.js`

that means Vite is blocking files outside `qwik-app` root. This repo's
`qwik-app/vite.config.ts` includes a scoped allowlist for linked Stencil output.

After changing Stencil component code, rebuild and relink:

```sh
cd stencil-js-lib
npm run build
npm link

cd ../qwik-app
npm link stencil-js-lib
npm run sync:stencil-esm
npm run dev
```
