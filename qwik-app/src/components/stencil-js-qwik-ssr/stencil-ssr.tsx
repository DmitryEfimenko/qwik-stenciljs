import {
  component$,
  isBrowser,
  isServer,
  type QRL,
  Slot,
  SSRRaw,
  SSRStream,
  useSignal,
  useTask$,
} from '@builder.io/qwik';

import { updateStencilElementProps } from './element-props-utils';
import type { StencilRenderToString, StencilSSRProps } from './model';
import { collectStencilSsrStyles, createStencilSsrStyleStore } from './styles-core';

const INLINE_EMITTED_KEY = '__stencil_ssr_inline_emitted__';

/**
 * Extracts styles from `renderResult` and returns them as a concatenated
 * `<style>` HTML string, deduplicating across multiple renders in the same
 * request. Returns an empty string when there is nothing new to emit.
 */
function buildInlineStylesHtml(renderResult: Awaited<ReturnType<StencilRenderToString>>, tagName?: string): string {
  const reqEnv = (
    globalThis as { qcAsyncRequestStore?: { getStore?: () => unknown } }
  ).qcAsyncRequestStore?.getStore?.() as { sharedMap: Map<string, unknown> } | undefined;

  let emittedKeys: Set<string>;
  if (reqEnv?.sharedMap instanceof Map) {
    const existing = reqEnv.sharedMap.get(INLINE_EMITTED_KEY) as Set<string> | undefined;
    if (existing) {
      emittedKeys = existing;
    } else {
      emittedKeys = new Set<string>();
      reqEnv.sharedMap.set(INLINE_EMITTED_KEY, emittedKeys);
    }
  } else {
    emittedKeys = new Set<string>();
  }

  const tempStore = createStencilSsrStyleStore();
  collectStencilSsrStyles(renderResult, tempStore, tagName);

  let html = '';
  for (const [key, style] of tempStore.stylesByKey) {
    if (!emittedKeys.has(key)) {
      emittedKeys.add(key);
      html += `<style sty-id="${key}">${style}</style>`;
    }
  }
  return html;
}

const DEFAULT_SLOT_MARKER = '<!--SLOT-->';

function namedSlotMarker(name: string) {
  return `<!--SLOT:${name}-->`;
}

/**
 * Builds the HTML string passed to Stencil's renderToString.
 * The default slot gets `<!--SLOT-->` as its light-DOM child.
 * Each named slot gets a `<div slot="name"><!--SLOT:name--></div>` wrapper
 * so Stencil places the marker inside the correct slot outlet in its output.
 */
function buildInputHtml(tagName: string, slots: string[]) {
  const namedSlotHtml = slots
    .map((s) => `<div slot="${s}" style="display:contents">${namedSlotMarker(s)}</div>`)
    .join('');
  return `<${tagName}>${DEFAULT_SLOT_MARKER}${namedSlotHtml}</${tagName}>`;
}

type SlotEntry = { marker: string; name?: string };

/**
 * Locates all slot markers present in `html`, sorted by their position.
 * Returns entries only for markers that actually appear in the output
 * (Stencil may omit a slot outlet if it has no matching slot element).
 */
function collectSlotEntries(html: string, namedSlots: string[]): SlotEntry[] {
  const candidates: SlotEntry[] = [
    { marker: DEFAULT_SLOT_MARKER, name: undefined },
    ...namedSlots.map((s) => ({ marker: namedSlotMarker(s), name: s })),
  ];

  return candidates
    .filter((e) => html.includes(e.marker))
    .sort((a, b) => html.indexOf(a.marker) - html.indexOf(b.marker));
}

export function createStencilSSRComponent(
  stencilRenderToStringQrl: QRL<StencilRenderToString>,
  options?: {
    onSsrRenderResultQrl?: QRL<
      (result: Awaited<ReturnType<StencilRenderToString>>) => void | Promise<void>
    >;
  },
) {
  return component$<StencilSSRProps>(({ tagName, props, slots, ...restProps }) => {
    const wrapperRef = useSignal<HTMLDivElement | undefined>(undefined);
    const namedSlots = slots ?? [];

    // Keeps the Stencil element's props in sync with Qwik signals on the client.
    // On the server, props are applied via `beforeHydrate` inside the SSRStream.
    useTask$(({ track }) => {
      const trackedProps = track(() => props);
      if (!isBrowser) return;
      const stencilEl = wrapperRef.value?.querySelector(tagName);
      updateStencilElementProps(stencilEl, trackedProps);
    });

    if (isServer) {
      return (
        <div ref={wrapperRef} {...restProps} style={{ display: 'contents' }}>
          <SSRStream>
            {async function* () {
              const renderToString = await stencilRenderToStringQrl.resolve();

              const renderResult = await renderToString(
                buildInputHtml(tagName, namedSlots),
                {
                  prettyHtml: true,
                  removeScripts: false,
                  beforeHydrate: (root) => {
                    const stencilElement = root.querySelector(tagName);
                    updateStencilElementProps(stencilElement, props);
                  },
                },
              );
              const { html } = renderResult;
              if (options?.onSsrRenderResultQrl) {
                const onSsrRenderResult = await options.onSsrRenderResultQrl.resolve();
                await onSsrRenderResult(renderResult);
              }

              // Inline-emit component styles, deduped per request so the same
              // CSS is not repeated when the same component appears multiple times.
              const inlineStylesHtml = buildInlineStylesHtml(renderResult, tagName);
              if (inlineStylesHtml) {
                yield <SSRRaw data={inlineStylesHtml} />;
              }

              // `fullDocument` option is unavailable in some Stencil versions,
              // so extract the body content manually.
              const bodyHtml =
                html.match(/<body>([\s\S]*)<\/body>/)?.[1] || html;

              const entries = collectSlotEntries(bodyHtml, namedSlots);

              if (entries.length === 0) {
                // Component has no slots at all — emit the full HTML as-is.
                yield <SSRRaw data={bodyHtml} />;
                return;
              }

              // Walk through the body HTML, interleaving SSRRaw segments with
              // Qwik <Slot /> / <Slot name="..." /> at each marker position.
              let cursor = 0;
              for (const entry of entries) {
                const markerIndex = bodyHtml.indexOf(entry.marker, cursor);
                yield <SSRRaw data={bodyHtml.slice(cursor, markerIndex)} />;
                if (entry.name) {
                  yield <Slot name={entry.name} />;
                } else {
                  yield <Slot />;
                }
                cursor = markerIndex + entry.marker.length;
              }
              // Emit any HTML that follows the last marker.
              if (cursor < bodyHtml.length) {
                yield <SSRRaw data={bodyHtml.slice(cursor)} />;
              }
            }}
          </SSRStream>
        </div>
      );
    }

    // On the client, Stencil upgrades the custom element and handles
    // rendering. Qwik projects default and named children via <Slot />.
    return (
      <div ref={wrapperRef} {...restProps} style={{ display: 'contents' }}>
        <Slot />
        {namedSlots.map((name) => (
          <Slot name={name} key={name} />
        ))}
      </div>
    );
  });
}
