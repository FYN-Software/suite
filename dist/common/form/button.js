import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Button extends Component {
    static localName = 'fyn-common-form-button';
    static styles = ['fyn.suite.base'];
    icons = [];
    iconType = 'fas';
    action = '';
    tooltip = '';
    togglable = false;
    state = false;
    async initialize() {
        this.setAttribute("tabindex", "0");
        this.observe({
            state: () => this.attributes.setOnAssert(this.state, 'active'),
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
], Button.prototype, "icons", void 0);
__decorate([
    property()
], Button.prototype, "iconType", void 0);
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
//# sourceMappingURL=button.js.map