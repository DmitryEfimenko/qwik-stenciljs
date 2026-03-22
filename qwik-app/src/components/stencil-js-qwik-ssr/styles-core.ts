import type { DocumentStyle, RequestEventBase } from '@builder.io/qwik-city';
import type {
  StencilRenderToString,
  StencilRenderToStringResult,
} from './model';

const STENCIL_STYLE_STORE_KEY = '__stencil_ssr_style_store__';
const STENCIL_HYDRATED_STYLE_ID_PREFIX = 'sc-';

export interface StencilSsrCollectedStyle {
  key: string;
  style: string;
}

export interface StencilSsrStyleStore {
  stylesByKey: Map<string, string>;
}

export interface StencilSsrHeadStyleOptions {
  keyPrefix?: string;
  nonce?: string;
}

export interface StencilTagStyleRenderOptions {
  serializeShadowRoot?:
    | 'declarative-shadow-dom'
    | 'scoped'
    | {
        'declarative-shadow-dom'?: string[];
        scoped?: string[];
        default: 'declarative-shadow-dom' | 'scoped';
      }
    | boolean;
  cache?: Map<string, DocumentStyle[]>;
}

const stencilCriticalStyleCache = new Map<string, DocumentStyle[]>();

function normalizeStyleKey(
  styleId?: string,
  styleText = '',
  tagName?: string,
): string {
  if (styleId && styleId.length > 0) {
    return styleId;
  }
  // If no styleId but tagName available, use scope ID convention (sc-${tagName})
  if (tagName) {
    return `sc-${tagName}`;
  }
  // Fallback to content-based key
  return `inline-${styleText.length}-${styleText.slice(0, 32)}`;
}

function extractStylesFromHtml(
  html: string,
  tagName?: string,
): StencilSsrCollectedStyle[] {
  const matches = html.matchAll(
    /<style[^>]*sty-id="([^"]+)"[^>]*>([\s\S]*?)<\/style>/gi,
  );
  const styles: StencilSsrCollectedStyle[] = [];

  for (const match of matches) {
    const key = normalizeStyleKey(match[1], match[2] ?? '', tagName);
    const style = match[2] ?? '';
    if (!style) continue;
    styles.push({ key, style });
  }

  return styles;
}

export function createStencilSsrStyleStore(): StencilSsrStyleStore {
  return {
    stylesByKey: new Map<string, string>(),
  };
}

export function getOrCreateStencilSsrStyleStore(
  requestEvent: Pick<RequestEventBase, 'sharedMap'>,
): StencilSsrStyleStore {
  const existing = requestEvent.sharedMap.get(STENCIL_STYLE_STORE_KEY) as
    | StencilSsrStyleStore
    | undefined;

  if (existing) {
    return existing;
  }

  const created = createStencilSsrStyleStore();
  requestEvent.sharedMap.set(STENCIL_STYLE_STORE_KEY, created);
  return created;
}

export function collectStencilSsrStyles(
  result: StencilRenderToStringResult,
  styleStore: StencilSsrStyleStore,
  tagName?: string,
) {
  if (result.styles && result.styles.length > 0) {
    for (const styleEntry of result.styles) {
      const styleText = styleEntry.content ?? '';
      const styleId = styleEntry.id;
      if (!styleText) continue;

      const key = normalizeStyleKey(styleId, styleText, tagName);
      styleStore.stylesByKey.set(key, styleText);
    }
    return;
  }

  for (const styleEntry of extractStylesFromHtml(result.html, tagName)) {
    styleStore.stylesByKey.set(styleEntry.key, styleEntry.style);
  }
}

export function toDocumentHeadStyles(
  styleStore: StencilSsrStyleStore,
  options?: StencilSsrHeadStyleOptions,
): DocumentStyle[] {
  const keyPrefix = options?.keyPrefix ?? 'stencil-ssr';
  const nonce = options?.nonce;

  return [...styleStore.stylesByKey.entries()].map(([styleKey, style]) => ({
    key: `${keyPrefix}-${styleKey}`,
    style,
    props: nonce ? { nonce } : undefined,
  }));
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function isCustomElementTag(tag: string): boolean {
  return /^[a-z0-9]+-[a-z0-9-]+$/.test(tag);
}

function buildTagSetCacheKey(
  tags: string[],
  serializeShadowRoot: StencilTagStyleRenderOptions['serializeShadowRoot'],
) {
  const serializeKey =
    typeof serializeShadowRoot === 'object'
      ? JSON.stringify(serializeShadowRoot)
      : String(serializeShadowRoot ?? 'declarative-shadow-dom');
  return `${tags.join('|')}::${serializeKey}`;
}

export function getStencilCriticalStyleCache() {
  return stencilCriticalStyleCache;
}

export async function renderStencilStylesForTags(
  renderStencilToString: StencilRenderToString,
  tags: string[],
  options?: StencilTagStyleRenderOptions,
): Promise<DocumentStyle[]> {
  const uniqueTags = [
    ...new Set(tags.map(normalizeTag).filter(isCustomElementTag)),
  ].sort();

  if (uniqueTags.length === 0) {
    return [];
  }

  const serializeShadowRoot =
    options?.serializeShadowRoot ?? 'declarative-shadow-dom';
  const cache = options?.cache ?? stencilCriticalStyleCache;
  const cacheKey = buildTagSetCacheKey(uniqueTags, serializeShadowRoot);
  const cachedStyles = cache.get(cacheKey);
  if (cachedStyles) {
    return cachedStyles;
  }

  const inputHtml = uniqueTags.map((tag) => `<${tag}></${tag}>`).join('');
  const result = await renderStencilToString(inputHtml, {
    prettyHtml: false,
    removeScripts: true,
    removeUnusedStyles: true,
    fullDocument: true,
    serializeShadowRoot,
  });

  const styleStore = createStencilSsrStyleStore();
  collectStencilSsrStyles(result, styleStore);
  const styles = toDocumentHeadStyles(styleStore, {
    keyPrefix: 'stencil-critical',
  });
  cache.set(cacheKey, styles);
  return styles;
}

export function getStencilHydratedStyleIdPrefix() {
  return STENCIL_HYDRATED_STYLE_ID_PREFIX;
}
