import { JSXNode, QRL, Signal } from '@builder.io/qwik';

export type StencilSlotContent =
  | string
  | number
  | boolean
  | null
  | undefined
  | StencilSlotContent[]
  | Signal<StencilSlotContent>
  | JSXNode;

export interface StencilRenderToStringOptions {
  prettyHtml?: boolean;
  removeScripts?: boolean;
  beforeHydrate?: (root: ParentNode) => void;
}

export interface StencilRenderToStringResult {
  html: string;
}

export type StencilRenderToString = (
  input: string,
  options?: StencilRenderToStringOptions,
) => Promise<StencilRenderToStringResult>;

export interface StencilSSRProps {
  tagName: string;
  // tagContent?: string;
  tagContent?: QRL<() => JSXNode>;
  props: Record<string, unknown>;
  [key: string]: unknown;
}
