import { __decorate } from "tslib";
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Checkbox extends FormAssociated {
    static localName = 'fyn-common-form-checkbox';
    static styles = ['fyn.suite.base'];
    toggle = false;
    get checked() {
        return this.value;
    }
    locked = false;
    closable = false;
    async initialize() {
        this.observe({
            value: (o, n) => {
                this.shadow.querySelector('#box').setAttribute('checked', String(this.value));
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
                this.value = !this.value;
            },
            mousedown: e => console.log(e),
        });
    }
}
__decorate([
    property()
], Checkbox.prototype, "toggle", void 0);
__decorate([
    property()
], Checkbox.prototype, "checked", null);
__decorate([
    property()
], Checkbox.prototype, "locked", void 0);
__decorate([
    property()
], Checkbox.prototype, "closable", void 0);
//# sourceMappingURL=checkbox.js.map