import { $ } from '@builder.io/qwik';
import type { StencilRenderToStringOptions } from './stencil-js-qwik-ssr/model';
import { createStencilSSRComponent } from './stencil-js-qwik-ssr/stencil-js-qwik-ssr';

const renderStencilToString = async (
	input: string,
	options?: StencilRenderToStringOptions,
) => {
	// `stencil-js-lib/hydrate` is Node-only; avoid importing it into the client bundle.
	if (!import.meta.env.SSR) {
		return { html: input };
	}

	const hydrateModuleId = 'stencil-js-lib/' + 'hydrate';
	const { renderToString } = await import(
		/* @vite-ignore */ hydrateModuleId
	);
	const result = await renderToString(input, options);

	return {
		html: result.html ?? '',
	};
};

export const StencilLibSSR = createStencilSSRComponent($(renderStencilToString));
