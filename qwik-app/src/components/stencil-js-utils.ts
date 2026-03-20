import type { StencilRenderToStringOptions } from './stencil-js-qwik-ssr/model';

export async function defineCustomElements() {
  // With a regular npm-installed Stencil package, this is usually much simpler:
  // import { defineCustomElements } from '<package>/loader' and call it directly.
  // This demo loads copied output targets instead, so we can avoid npm-link-specific
  // Vite server/fs configuration complexity while still showing Stencil in Qwik.
  const stencilLoaderUrl = '/stencil-runtime/esm/loader.js';
  const { defineCustomElements: defineCustomElementsFromLoader } = await import(
    /* @vite-ignore */ stencilLoaderUrl
  );

  await defineCustomElementsFromLoader(undefined, {
    resourcesUrl: '/stencil-runtime/esm/',
  });
}

export async function renderStencilToString(
  input: string,
  options?: StencilRenderToStringOptions,
) {
  if (!import.meta.env.SSR) {
    return { html: input };
  }

  // With regular npm-installed components, this would typically be a direct
  // package import. In this demo we load the copied hydrate output target so
  // SSR does not depend on npm link resolution behavior.
  const cwdPosix = process.cwd().replace(/\\/g, '/');
  const hydrateModuleId = encodeURI(
    `file:///${cwdPosix}/public/stencil-runtime/hydrate/index.mjs`,
  );
  const { renderToString } = await import(/* @vite-ignore */ hydrateModuleId);
  const result = await renderToString(input, options);

  return {
    html: result.html ?? '',
  };
}
