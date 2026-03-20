import { b as bootstrapLazy } from './index-kGK9-YDr.js';
export { s as setNonce } from './index-kGK9-YDr.js';
import { g as globalScripts } from './app-globals-DQuL1Twl.js';

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await globalScripts();
  return bootstrapLazy([["de-button",[[772,"de-button",{"size":[1]}]]]], options);
};

export { defineCustomElements };
