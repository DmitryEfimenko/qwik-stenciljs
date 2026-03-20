import { r as registerInstance, h } from './index-AbUtTX3A.js';

const deButtonCss = () => `.de-button{background-color:var(--de-button-bg, #007bff);display:inline-block;padding:0.5em 1em;border:none;border-radius:4px;color:white;font-size:1rem;cursor:pointer}.de-button--sm{font-size:0.875rem;padding:0.25em 0.5em}.de-button--lg{font-size:1.25rem;padding:0.75em 1.5em}`;

const DeButton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    size = 'md';
    render() {
        return (h("button", { key: '309584230c30377fea687543f6497162f879175b', class: `de-button de-button--${this.size}` }, h("slot", { key: '98ad927948e1a652edc66d287f51d074c332ec7c' })));
    }
};
DeButton.style = deButtonCss();

export { DeButton as de_button };
