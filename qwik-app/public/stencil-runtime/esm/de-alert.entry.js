import { r as registerInstance, h } from './index-AbUtTX3A.js';

const deAlertCss = () => `.de-alert{background-color:var(--de-alert-bg, #f8d7da);color:var(--de-alert-color, #721c24);padding:1em;border:1px solid var(--de-alert-border, #f5c6cb);border-radius:4px}.de-alert__content{margin-top:0.5em}`;

const DeAlert = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    heading = 'Alert';
    render() {
        return (h("div", { key: '46071e0882c1fde08cf35121c9991fa63597c811', class: "de-alert" }, h("strong", { key: '0387e3cb64e06c2b35f278f01011945abfdbf07d' }, this.heading), h("div", { key: 'dc9bb00a59d4f783df0d9920c9f35a226582e068', class: "de-alert__content" }, h("slot", { key: 'e5b34579a4328f0c97eec04ce3aa106aadc60380' }))));
    }
};
DeAlert.style = deAlertCss();

export { DeAlert as de_alert };
