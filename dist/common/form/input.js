var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Input extends FormAssociated {
    constructor() {
        super(...arguments);
        this.placeholder = '';
        this.regex = '(?!\\n).';
        this.multiline = false;
    }
    async initialize() {
        this.shadow.on('input', {
            options: {
                passive: false,
            },
            keydown: async (e) => {
                if ([8, 16, 17, 37, 38, 39, 40].includes(e.keyCode)) {
                    return;
                }
                // FUCK ES SOMETIMES!! cant just read the character about to be inserted...
                let char;
                switch (e.key) {
                    case 'Enter':
                        char = '\n';
                        break;
                    default:
                        char = e.key;
                        break;
                }
                if (new RegExp(`^(${this.regex})*$`, 'g').test(this.value + char) === false) {
                    e.preventDefault();
                }
            },
            keyup: _ => {
                this.value = this.shadow.querySelector('input').value;
            },
        });
        this.shadow.on('input', {
            options: {
                capture: true,
            },
            focus: (e, t) => {
                // t.focused = true;
                this.setAttribute('focused', '');
            },
            blur: (e, t) => {
                // t.focused = false;
                this.removeAttribute('focused');
            },
        });
    }
    async ready() {
        this.observe({
            value: (o, n) => {
                this.shadow.querySelector('input').value = this.value;
                this.attributes.setOnAssert(this.value.length > 0, 'has-value');
                this.emit('change', { old: o, new: n });
            },
        });
    }
    focus() {
        this.shadow.querySelector('input').focus();
    }
}
Input.localName = 'fyn-common-form-input';
Input.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Input.prototype, "placeholder", void 0);
__decorate([
    property()
], Input.prototype, "regex", void 0);
__decorate([
    property()
], Input.prototype, "multiline", void 0);
//# sourceMappingURL=input.js.map