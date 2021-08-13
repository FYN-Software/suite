import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Form extends Component {
    static localName = 'fyn-common-form-form';
    static styles = ['fyn.suite.base'];
    title = '';
    action = '';
    messages = [];
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
        }
    }
    get elements() {
        return this.shadow.querySelector('fields > slot')
            .assignedElements({ flatten: true })
            .filter(e => e.constructor.hasOwnProperty('formAssociated'));
    }
}
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