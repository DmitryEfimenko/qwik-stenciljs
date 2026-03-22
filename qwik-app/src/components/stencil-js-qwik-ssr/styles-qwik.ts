import {
  type DocumentHead,
  type DocumentHeadValue,
  type DocumentStyle,
  type RequestEventBase,
} from '@builder.io/qwik-city';
import type {
  StencilRenderToString,
  StencilRenderToStringResult,
} from './model';
import {
  collectStencilSsrStyles,
  getOrCreateStencilSsrStyleStore,
  renderStencilStylesForTags,
  toDocumentHeadStyles,
} from './styles-core';

export interface QwikStencilSsrStylesOptions {
  keyPrefix?: string;
  nonce?: string;
  fallback?: {
    renderToString: StencilRenderToString;
    tags: string[];
  };
}

function dedupeStyles(styles: DocumentStyle[]) {
  const seen = new Set<string>();
  const deduped: DocumentStyle[] = [];

  for (const styleEntry of styles) {
    const styleKey = styleEntry.key ?? styleEntry.style;
    if (seen.has(styleKey)) {
      continue;
    }
    seen.add(styleKey);
    deduped.push(styleEntry);
  }

  return deduped;
}

/**
 * Option D facade: Qwik-focused integration helpers backed by Option A core.
 * The request event sharedMap keeps style collection request-scoped.
 */
export function createQwikStencilSsrStyles(
  options?: QwikStencilSsrStylesOptions,
) {
  return {
    collect(
      requestEvent: Pick<RequestEventBase, 'sharedMap'>,
      result: StencilRenderToStringResult,
    ) {
      const store = getOrCreateStencilSsrStyleStore(requestEvent);
      collectStencilSsrStyles(result, store);
    },
    toHeadStyles(
      requestEvent: Pick<RequestEventBase, 'sharedMap'>,
    ): DocumentStyle[] {
      const store = getOrCreateStencilSsrStyleStore(requestEvent);
      return toDocumentHeadStyles(store, {
        keyPrefix: options?.keyPrefix,
        nonce: options?.nonce,
      });
    },
    async resolveHeadStyles(
      requestEvent: Pick<RequestEventBase, 'sharedMap'>,
    ): Promise<DocumentStyle[]> {
      const collectedStyles = this.toHeadStyles(requestEvent);
      const fallback = options?.fallback;
      if (!import.meta.env.SSR || !fallback || fallback.tags.length === 0) {
        return dedupeStyles(collectedStyles);
      }

      const fallbackStyles = await renderStencilStylesForTags(
        fallback.renderToString,
        fallback.tags,
      );
      return dedupeStyles([...collectedStyles, ...fallbackStyles]);
    },
    createHead(
      stylesLoader: (...args: any[]) => unknown,
      baseHead?: DocumentHeadValue,
    ): DocumentHead {
      return ({ resolveValue, head }) => {
        const resolveStyles = resolveValue as (
          loader: unknown,
        ) => DocumentStyle[];
        const resolvedStyles = resolveStyles(stylesLoader);

        return {
          ...head,
          ...baseHead,
          styles: dedupeStyles([
            ...(head.styles ?? []),
            ...(baseHead?.styles ?? []),
            ...resolvedStyles,
          ]),
        };
      };
    },
    clear(requestEvent: Pick<RequestEventBase, 'sharedMap'>) {
      const store = getOrCreateStencilSsrStyleStore(requestEvent);
      store.stylesByKey.clear();
    },
  };
}
