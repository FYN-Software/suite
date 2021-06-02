var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Checkbox extends FormAssociated {
    constructor() {
        super(...arguments);
        this.toggle = false;
        this.checked = false;
        this.locked = false;
        this.closable = false;
    }
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
Checkbox.localName = 'fyn-common-form-checkbox';
Checkbox.styles = ['fyn.suite.base', 'global.theme'];
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