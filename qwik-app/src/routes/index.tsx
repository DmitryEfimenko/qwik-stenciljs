import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StencilLibSSR } from '../components/stencil-lib-ssr';


export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const stencilLoaderUrl = '/stencil/esm/loader.js';
    const { defineCustomElements } = await import(
      /* @vite-ignore */ stencilLoaderUrl
    );
    await defineCustomElements(undefined, {
      resourcesUrl: '/stencil/esm/',
    });
  });

  const ssrButtonText = $(() => <>Rendered via stencil-js-lib/hydrate</>);
  
  return (
    <>
      <div>
        <p>Client-side rendered (local stencil-js-lib):</p>
        <de-button size="lg">Get Started</de-button>
      </div>

      <hr />

      <div>
        <p>Server-side rendered (stencil-js-lib/hydrate):</p>
        <StencilLibSSR
          tagName='de-button'
          tagRender={ssrButtonText}
          props={{ size: 'md' }}
        />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
