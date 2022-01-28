import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { setAttributeOnAssert, setClassOnAssert } from '@fyn-software/core/function/dom.js';
export default class Button extends Component {
    static localName = 'fyn-common-form-button';
    static styles = ['fyn.suite.base'];
    action = '';
    tooltip = '';
    togglable = false;
    state = false;
    disabled = false;
    async initialize() {
        this.setAttribute('tabindex', '0');
        this.observe({
            state: () => setAttributeOnAssert(this, this.state, 'active'),
            disabled: () => setClassOnAssert(this, this.disabled, 'disabled'),
        });
        this.on({
            options: {
                details: false,
            },
            click: (e, target) => {
                if (e instanceof CustomEvent) {
                    return;
                }
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (this.disabled === true) {
                    return;
                }
                const ripple = this.shadow.querySelector('ripple > inner');
                ripple.removeAttribute('click');
                (async () => {
                    const { x, y } = target.getBoundingClientRect();
                    ripple.style.left = `calc(${e.pageX - x}px - var(--size) / 2)`;
                    ripple.style.top = `calc(${e.pageY - y}px - var(--size) / 2)`;
                    ripple.setAttribute('click', '');
                })();
                if (this.togglable === true) {
                    this.state = !this.state;
                }
                this.emit('click', { previous: e, action: this.action || this.getAttribute('action') });
            },
        });
    }
    async ready() {
    }
}
__decorate([
    property()
], Button.prototype, "action", void 0);
__decorate([
    property()
], Button.prototype, "tooltip", void 0);
__decorate([
    property()
], Button.prototype, "togglable", void 0);
__decorate([
    property()
], Button.prototype, "state", void 0);
__decorate([
    property()
], Button.prototype, "disabled", void 0);
//# sourceMappingURL=button.js.map