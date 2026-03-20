import { $ } from '@builder.io/qwik';
import { createStencilSSRComponent } from './stencil-js-qwik-ssr/stencil-js-qwik-ssr';
import { renderStencilToString } from './stencil-js-utils';

export const StencilLibSSR = createStencilSSRComponent($(renderStencilToString));
