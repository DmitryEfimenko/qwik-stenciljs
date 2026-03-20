import { r as registerInstance, h } from './index-kGK9-YDr.js';

const deButtonCss = () => `de-button{display:inline-block;padding:0.5em 1em;border:none;border-radius:4px;background-color:#007bff;color:white;font-size:1rem;cursor:pointer;&--sm{font-size:0.875rem;padding:0.25em 0.5em}&--lg{font-size:1.25rem;padding:0.75em 1.5em}}`;

const DeButton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    size = 'md';
    render() {
        return (h("button", { key: '893160091a4308bf44090a91003359c262b4f3db', class: `de-button de-button--${this.size}` }, h("slot", { key: '5838897d87ec10e74c8a28e3ae2867a7fa2c7a35' })));
    }
};
DeButton.style = deButtonCss();

export { DeButton as de_button };
