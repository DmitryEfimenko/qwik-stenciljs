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
