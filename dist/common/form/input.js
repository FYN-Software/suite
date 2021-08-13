import { __decorate } from "tslib";
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Input extends FormAssociated {
    static localName = 'fyn-common-form-input';
    static styles = ['fyn.suite.base'];
    placeholder = '';
    regex = '(?!\\n).';
    inputmode = '';
    async initialize() {
        this.shadow.on('input', {
            options: {
                passive: false,
            },
            keydown: async (e) => {
                if ([8, 16, 17, 37, 38, 39, 40].includes(e.keyCode)) {
                    return;
                }
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
                this.setAttribute('focused', '');
            },
            blur: (e, t) => {
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
__decorate([
    property()
], Input.prototype, "placeholder", void 0);
__decorate([
    property()
], Input.prototype, "regex", void 0);
__decorate([
    property()
], Input.prototype, "inputmode", void 0);
//# sourceMappingURL=input.js.map