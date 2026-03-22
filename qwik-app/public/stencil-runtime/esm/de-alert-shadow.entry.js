import { r as registerInstance, h } from './index-BEXmMfjP.js';

const deAlertShadowCss = () => `.de-alert{background-color:var(--de-alert-bg, #f8d7da);color:var(--de-alert-color, #721c24);padding:1em;border:1px solid var(--de-alert-border, #f5c6cb);border-radius:4px}.de-alert__content{margin-top:0.5em}`;

const DeAlertShadow = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    heading = 'Alert';
    render() {
        return (h("div", { key: '85a1c15d43c07cbd078dea886c9bcbd89e276ac4', class: "de-alert" }, h("strong", { key: '0ca812396c3115dfada2b5e48088a4ee33ca8133' }, this.heading), h("div", { key: '361de6e72e67c35435ca2bf7282220c9a6bb1df3', class: "de-alert__content" }, h("slot", { key: '876707ebf9c9192e2744d89b659ba6d119685fd1' })), h("div", { key: 'e946ca27307b679f86fac18c2060cfb6d5354f9b', class: "de-alert__footer" }, h("slot", { key: '7d7337816f1ff6afe1f6c2c014ab0fa9e0ed5c29', name: "footer" }))));
    }
};
DeAlertShadow.style = deAlertShadowCss();

export { DeAlertShadow as de_alert_shadow };
