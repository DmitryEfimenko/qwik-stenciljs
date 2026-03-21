import { r as registerInstance, h } from './index-OzFPMOCw.js';

const deButtonCss = () => `.de-button{background-color:var(--de-button-bg, #007bff);display:inline-block;padding:0.5em 1em;border:none;border-radius:4px;color:white;font-size:1rem;cursor:pointer}.de-button--sm{font-size:0.875rem;padding:0.25em 0.5em}.de-button--lg{font-size:1.25rem;padding:0.75em 1.5em}`;

const DeButton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    size = 'md';
    render() {
        return (h("button", { key: 'ec0c8f1fd1774fd83b3b7ddb362f1d0564d1b4a3', class: `de-button de-button--${this.size}` }, h("slot", { key: 'faf494d1e3a97c0eaf71ac4a9c4f93d5e8271ba6' })));
    }
};
DeButton.style = deButtonCss();

export { DeButton as de_button };
