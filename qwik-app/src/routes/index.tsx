import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { defineCustomElements } from '../components/stencil-js-utils';
import { StencilLibSSR } from '../components/stencil-lib-ssr';


export default component$(() => {
  const size = useSignal<'md' | 'lg'>('md');

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    await defineCustomElements();
  });

  const ssrButtonText$ = $(() => <>Rendered via SSR</>);

  const changeSize$ = $(() => {
    size.value = size.value === 'md' ? 'lg' : 'md';
  });

  const alertContent$ = $(() => (
    <StencilLibSSR
      tagName='de-button'
      tagContent={ssrButtonText$}
      props={{ size: size.value }}
      onClick$={changeSize$}
    />
  ));
  
  return (
    <>
      <div>
        <p>
          Client-side rendered.<br />
          Click handler toggles size on all buttons on the page.
        </p>

        <de-button size={size.value} onClick$={changeSize$}>Rendered via CSR</de-button>
      </div>

      <hr />

      <div>
        <p>
          Server-side rendered (check Network request response to verify).<br />
          Click handler toggles size on all buttons on the page.
        </p>

        <StencilLibSSR
          tagName='de-button'
          tagContent={ssrButtonText$}
          props={{ size: size.value }}
          onClick$={changeSize$}
        />
      </div>

      <hr />

      <div>
        <p>
          Server-side rendered alert with slotted content.<br />
          The slot contains another server-side rendered button.<br />
          <b>Click handler does not work!</b>
        </p>

        <StencilLibSSR
          tagName='de-alert'
          tagContent={alertContent$}
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
