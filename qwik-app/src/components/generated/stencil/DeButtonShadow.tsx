import { component$, Slot } from '@builder.io/qwik';
import { GeneratedStencilComponent } from './runtime.generated';

export interface DeButtonShadowProps {
  size?: "lg" | "md" | "sm";
  [key: string]: unknown;
}

export const DeButtonShadow = component$<DeButtonShadowProps>((props) => {
  const eventProps: Record<string, unknown> = {};
  const elementProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props as Record<string, unknown>)) {
    if (key === 'children') {
      continue;
    }

    if (key.startsWith('on') || key.startsWith('$')) {
      eventProps[key] = value;
      continue;
    }

    elementProps[key] = value;
  }

  return (
    <GeneratedStencilComponent
      tagName="de-button-shadow"
      props={elementProps}
      slots={undefined}
      {...eventProps}
    >
      <Slot />
    </GeneratedStencilComponent>
  );
});
