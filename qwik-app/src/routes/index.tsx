import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { StencilJsLibSSRComponent, useStencilClientSetup } from '../components/stencil-lib-ssr';

export default component$(() => {
  const size = useSignal<'md' | 'lg'>('md');
  useStencilClientSetup();

  const changeSize$ = $(() => {
    size.value = size.value === 'md' ? 'lg' : 'md';
  });
  
  return (
    <>
      <div>
        <p>
          Client-side rendered.<br />
          Click handler toggles size on all buttons on the page.
        </p>

        {/* <de-button size={size.value} onClick$={changeSize$}>Rendered via CSR</de-button> */}
      </div>

      <hr />

      <div>
        <p>
          Server-side rendered (check Network request response to verify).<br />
          Click handler toggles size on all buttons on the page.
        </p>

        <StencilJsLibSSRComponent tagName='de-button' props={{ size: size.value }} onClick$={changeSize$}>
          Rendered via SSR
        </StencilJsLibSSRComponent>
      </div>

      <hr />

      <div>
        <p>
          Server-side rendered alert with slotted content.<br />
          The slot contains another server-side rendered button.
        </p>

        <StencilJsLibSSRComponent tagName='de-alert' props={{ heading: 'V2 Alert' }} slots={['footer']}>
          <p>Body content</p>
          <StencilJsLibSSRComponent tagName='de-button' props={{ size: size.value }} onClick$={changeSize$}>
            Rendered via SSR
          </StencilJsLibSSRComponent>
          <span q:slot="footer">Footer content (named slot)</span>
        </StencilJsLibSSRComponent>
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
