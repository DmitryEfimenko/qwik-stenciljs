import { r as registerInstance, h } from './index-BEXmMfjP.js';

const deButtonCss = () => `.de-button{background-color:var(--de-button-bg, #007bff);display:inline-block;padding:0.5em 1em;border:none;border-radius:4px;color:white;font-size:1rem;cursor:pointer}.de-button--sm{font-size:0.875rem;padding:0.25em 0.5em}.de-button--lg{font-size:1.25rem;padding:0.75em 1.5em}`;

const DeButton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    size = 'md';
    render() {
        return (h("button", { key: 'ad945f8c136d2e121ebc5a62878bb3cc6af569b6', class: `de-button de-button--${this.size}` }, h("slot", { key: '60d2657bcb6d6e8163609659f09729adbc063e5d' })));
    }
};
DeButton.style = deButtonCss();

export { DeButton as de_button };
