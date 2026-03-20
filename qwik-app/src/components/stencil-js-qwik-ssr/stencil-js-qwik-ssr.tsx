import {
  component$,
  type QRL,
  Resource,
  useResource$,
  useSignal,
  useTask$,
} from '@builder.io/qwik';

import { StencilRenderToString, StencilSSRProps } from './model';
import { resolveStencilInnerContent, updateStencilElementProps } from './utils';

export function createStencilSSRComponent(
  stencilRenderToStringQrl: QRL<StencilRenderToString>
) {
  return component$<StencilSSRProps>(
    ({ tagName, tagRender, props, ...restProps }) => {
      const wrapperRef = useSignal<HTMLDivElement | undefined>(undefined);
      const ssrResult = useResource$(async ({ track }) => {
        const trackedTagRenderQrl = track(() => tagRender);

        const innerContent = trackedTagRenderQrl
          ? await resolveStencilInnerContent(trackedTagRenderQrl)
          : '';

        const markupToRender = `<${tagName}>${innerContent}</${tagName}>`;

        const renderToString = await stencilRenderToStringQrl.resolve();

        const { html } = await renderToString(markupToRender, {
          // fullDocument: false,
          prettyHtml: true,
          // removeScripts must be false to preserve Qwik event handlers
          // in the output HTML in case these are present in the slotted content.
          removeScripts: false,
          beforeHydrate: (root) => {
            const stencilElement = root.querySelector(tagName);
            updateStencilElementProps(stencilElement, props);
          },
        });
        // fullDocument is not available in Stencil version used by Pulse.
        // So we need to extract the body content manually.
        const componentHtml =
          html.match(/<body>([\s\S]*)<\/body>/)?.[1] || html;
        return componentHtml;
      });

      useTask$(({ track }) => {
        const trackedProps = track(() => props);

        const stencilEl = wrapperRef.value?.querySelector(tagName);
        updateStencilElementProps(stencilEl, trackedProps);
      });

      return (
        <Resource
          value={ssrResult}
          onPending={() => <div>Loading...</div>}
          onResolved={(html) => {
            return (
              /*
               Using `display: contents` makes this div "disappear"
               from the layout tree, so it won't break consumer's CSS.
             */
              <div
                ref={wrapperRef}
                {...restProps}
                style={{ display: 'contents' }}
                dangerouslySetInnerHTML={html}
              />
            );
          }}
        />
      );
    }
  );
}
