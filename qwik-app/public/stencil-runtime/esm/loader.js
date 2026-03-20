import { b as bootstrapLazy } from './index-AbUtTX3A.js';
export { s as setNonce } from './index-AbUtTX3A.js';
import { g as globalScripts } from './app-globals-DQuL1Twl.js';

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await globalScripts();
  return bootstrapLazy([["de-alert",[[772,"de-alert",{"heading":[1]}]]],["de-button",[[772,"de-button",{"size":[1]}]]]], options);
};

export { defineCustomElements };
