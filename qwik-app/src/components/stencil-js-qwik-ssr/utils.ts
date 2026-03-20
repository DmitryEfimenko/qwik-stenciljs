import { isSignal, JSXNode, QRL } from '@builder.io/qwik';
import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { StencilSlotContent } from './model';

function isSerializablePrimitive(value: unknown) {
  const valueType = typeof value;
  return (
    value == null ||
    valueType === 'string' ||
    valueType === 'number' ||
    valueType === 'boolean'
  );
}

export function updateStencilElementProps(
  el: Element | undefined | null,
  props: Record<string, unknown> | undefined,
) {
  if (!el || !props) return;

  const keys = Object.keys(props);

  for (const key of keys) {
    const value = props[key];
    const isEvent = key.startsWith('on') || key.startsWith('$');
    if (isEvent) {
      continue;
    }
    const isPrimitive = isSerializablePrimitive(value);
    if (isPrimitive) {
      el.setAttribute(key, String(value));
    } else {
      (el as any)[key] = value;
    }
  }
}

function trimStart(s: string) {
  return s.replace(/^\s+/, '');
}

function stripLeadingQwikArtifacts(html: string) {
  let normalizedHtml = html.trim();

  const leadingArtifactPattern =
    /^(?:<(?:link|style)\b[^>]*>\s*|<script\b[^>]*>[\s\S]*?<\/script>\s*)+/i;

  while (leadingArtifactPattern.test(normalizedHtml)) {
    normalizedHtml = trimStart(
      normalizedHtml.replace(leadingArtifactPattern, ''),
    );
  }

  return normalizedHtml;
}

function trimEnd(str: string) {
  return str.replace(/\s+$/, '');
}

function stripTrailingQwikArtifacts(html: string) {
  let normalizedHtml = html.trim();

  const trailingArtifactPattern =
    /(?:\s*<script\b[^>]*>[\s\S]*?<\/script>\s*)+$/i;

  while (trailingArtifactPattern.test(normalizedHtml)) {
    normalizedHtml = trimEnd(
      normalizedHtml.replace(trailingArtifactPattern, ''),
    );
  }

  return normalizedHtml;
}

function normalizeQwikFragmentHtml(html: string) {
  const containerMatch = html.match(
    /^<!--cq--><div\b[^>]*class="[^"]*qc📦[^"]*"[^>]*>([\s\S]*)<\/div><!--\/cq-->$/,
  );

  const unwrappedHtml = containerMatch?.[1] ?? html;

  return stripTrailingQwikArtifacts(stripLeadingQwikArtifacts(unwrappedHtml));
}

export async function resolveStencilInnerContent(
  tagRenderQrl: QRL<() => JSXNode>,
) {
  const renderedChildren = await tagRenderQrl!
    .resolve()
    .then((renderFn) => renderFn());

  // renderToString returns full Qwik container, which is not desired
  // for our use case since that container would be a separate
  // island that would not have access to parent container's state.
  // thus the usage of `normalizeQwikFragmentHtml` below, which is
  // a hacky workaround that does not full work. The button in the demo
  // now reacts to the state changes, but click handler does not work
  const result = await renderToString(renderedChildren, {
    containerTagName: 'div',
    manifest,
    qwikLoader: { include: 'never' },
    preloader: false,
    snapshot: false,
  });

  return normalizeQwikFragmentHtml(result.html);
}

function unwrapFunctionLikeContent(input: unknown): unknown {
  if (typeof input !== 'function') {
    return input;
  }

  try {
    const maybeValue = (input as () => unknown)();
    return maybeValue;
  } catch {
    return undefined;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsxChildrenToHtml(children: unknown): string {
  console.log('jsxChildrenToHtml', children);
  const normalizedChildren = unwrapFunctionLikeContent(children);

  if (
    normalizedChildren == null ||
    typeof normalizedChildren === 'boolean' ||
    normalizedChildren instanceof RegExp
  ) {
    return '';
  }

  if (
    typeof normalizedChildren === 'string' ||
    typeof normalizedChildren === 'number'
  ) {
    return escapeHtml(String(normalizedChildren));
  }

  if (Array.isArray(normalizedChildren)) {
    return normalizedChildren.map(jsxChildrenToHtml).join('');
  }

  if (isSignal(normalizedChildren)) {
    return jsxChildrenToHtml(normalizedChildren.value);
  }

  // Detect JSXNode (Qwik components or HTML elements)
  if (
    typeof normalizedChildren === 'object' &&
    'type' in (normalizedChildren as any)
  ) {
    return jsxNodeToHtml(normalizedChildren);
  }

  if (typeof normalizedChildren === 'function') {
    const unwrappedAgain = unwrapFunctionLikeContent(normalizedChildren);
    return unwrappedAgain === normalizedChildren
      ? ''
      : jsxChildrenToHtml(unwrappedAgain);
  }

  if (isJsxNodeLike(normalizedChildren)) {
    return jsxNodeToHtml(normalizedChildren);
  }

  return escapeHtml(String(normalizedChildren));
}

function jsxNodeToHtml(node: any): string {
  // 1. Handle Qwik Components (Functions/QRLs)
  if (typeof node.type === 'function') {
    // Execute the component function with its props to get the rendered JSX
    const rendered = node.type(node.props);
    return jsxChildrenToHtml(rendered);
  }

  // 2. Handle standard HTML tags (e.g., 'div', 'ps-button')
  if (typeof node.type === 'string') {
    const props = node.props || {};
    const attrs = Object.keys(props)
      .filter((key) => key !== 'children' && typeof key === 'string')
      .map((key) => ` ${key}="${escapeHtml(String(props[key]))}"`)
      .join('');

    const childrenHtml = jsxChildrenToHtml(node.children);
    return `<${node.type}${attrs}>${childrenHtml}</${node.type}>`;
  }

  return '';
}

function isJsxNodeLike(value: unknown): value is {
  type: unknown;
  props?: Record<string, unknown>;
  children?: StencilSlotContent | null;
  immutableProps?: Record<string, unknown> | null;
} {
  return !!value && typeof value === 'object' && 'type' in value;
}
