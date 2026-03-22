import { r as registerInstance, h } from './index-BEXmMfjP.js';

const deButtonShadowCss = () => `.de-button{background-color:var(--de-button-bg, #007bff);display:inline-block;padding:0.5em 1em;border:none;border-radius:4px;color:white;font-size:1rem;cursor:pointer}.de-button--sm{font-size:0.875rem;padding:0.25em 0.5em}.de-button--lg{font-size:1.25rem;padding:0.75em 1.5em}`;

const DeButtonShadow = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    size = 'md';
    render() {
        return (h("button", { key: '716325165d9427ee33b2f419c25c1d2b07e3ed8c', class: `de-button de-button--${this.size}` }, h("slot", { key: '674d1bb108b53070cbd7c0104ef79db83c28abb4' })));
    }
};
DeButtonShadow.style = deButtonShadowCss();

export { DeButtonShadow as de_button_shadow };
