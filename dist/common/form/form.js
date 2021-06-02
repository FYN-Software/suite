var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Form extends Component {
    constructor() {
        super(...arguments);
        this.title = '';
        this.action = '';
        this.messages = [];
    }
    async initialize() {
    }
    async ready() {
        this.shadow.on('form > *', {
            options: {
                passive: false,
            },
            keydown: e => {
                if (e.key === 'Enter') {
                    e.stopPropagation();
                    e.preventDefault();
                    this.submit();
                }
            },
        });
        this.on('[slot="buttons"][action]', {
            click: ({ action }) => {
                switch (action) {
                    case 'submit':
                        return this.submit();
                    case 'cancel':
                        return this.emit('cancel', { success: false });
                }
            },
        });
    }
    submit() {
        const elements = this.elements;
        if (elements.some(e => e.validity.valid === false)) {
            return;
        }
        const f = elements
            .filter(c => typeof c?.name === 'string' && c?.value !== undefined)
            .reduce((t, c) => Object.assign(t, { [c.name]: c.value }), {});
        this.emit('success', { success: true, ...f });
        return f;
    }
    clear() {
        for (const field of this.elements) {
            // field.clear();
        }
    }
    get elements() {
        return this.shadow.querySelector('fields > slot')
            .assignedElements({ flatten: true })
            .filter(e => e.constructor.hasOwnProperty('formAssociated'));
    }
}
Form.localName = 'fyn-common-form-form';
Form.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Form.prototype, "title", void 0);
__decorate([
    property()
], Form.prototype, "action", void 0);
__decorate([
    property()
], Form.prototype, "messages", void 0);
//# sourceMappingURL=form.js.map