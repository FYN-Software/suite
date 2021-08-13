import { __decorate } from "tslib";
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Checkbox extends FormAssociated {
    static localName = 'fyn-common-form-checkbox';
    static styles = ['fyn.suite.base'];
    toggle = false;
    checked = false;
    locked = false;
    closable = false;
    async initialize() {
        this.observe({
            value: (o, n) => {
                this.shadow.querySelector('#box').setAttribute('checked', String(n));
                this.emit('change', { old: o, new: n });
            },
        });
    }
    async ready() {
        this.shadow.on('box, label', {
            click: (e) => {
                if (this.locked) {
                    return;
                }
                this.checked = !this.checked;
            },
            mousedown: e => console.log(e),
        });
    }
}
__decorate([
    property()
], Checkbox.prototype, "toggle", void 0);
__decorate([
    property({ aliasFor: 'value' })
], Checkbox.prototype, "checked", void 0);
__decorate([
    property()
], Checkbox.prototype, "locked", void 0);
__decorate([
    property()
], Checkbox.prototype, "closable", void 0);
//# sourceMappingURL=checkbox.js.map