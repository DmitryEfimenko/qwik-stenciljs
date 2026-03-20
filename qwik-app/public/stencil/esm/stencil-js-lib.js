import { p as promiseResolve, b as bootstrapLazy } from './index-kGK9-YDr.js';
export { s as setNonce } from './index-kGK9-YDr.js';
import { g as globalScripts } from './app-globals-DQuL1Twl.js';

/*
 Stencil Client Patch Browser v4.43.3 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  const importMeta = import.meta.url;
  const opts = {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["de-button",[[772,"de-button",{"size":[1]}]]]], options);
});
