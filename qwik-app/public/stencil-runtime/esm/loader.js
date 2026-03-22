import { b as bootstrapLazy } from './index-BEXmMfjP.js';
export { s as setNonce } from './index-BEXmMfjP.js';
import { g as globalScripts } from './app-globals-DQuL1Twl.js';

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await globalScripts();
  return bootstrapLazy([["de-alert",[[772,"de-alert",{"heading":[1]}]]],["de-alert-shadow",[[769,"de-alert-shadow",{"heading":[1]}]]],["de-button",[[772,"de-button",{"size":[1]}]]],["de-button-shadow",[[769,"de-button-shadow",{"size":[1]}]]]], options);
};

export { defineCustomElements };
