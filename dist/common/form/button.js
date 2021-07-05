var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Button extends Component {
    constructor() {
        super(...arguments);
        this.icons = [];
        this.iconType = 'fas';
        this.action = '';
        this.tooltip = '';
        this.multi = false;
        this.togglable = false;
        this.state = false;
    }
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
                if (this.multi === true) {
                    const rect = this.getBoundingClientRect();
                    this.style.setProperty('--x', `${rect.x + rect.width / 2}px`);
                    this.style.setProperty('--y', `${rect.bottom}px`);
                    this.attributes.toggle('open');
                    const c = Array.from(this.children).find(c => e.composedPath().includes(c));
                    if (c !== undefined) {
                        this.emit('click', { previous: e, action: c.getAttribute('action') || this.action });
                    }
                }
                else {
                    if (this.togglable === true) {
                        this.state = !this.state;
                    }
                    this.emit('click', { previous: e, action: this.action || this.getAttribute('action') });
                }
            },
        });
        document.body.on({
            click: () => {
                if (this.multi === true) {
                    this.removeAttribute('open');
                }
            },
        });
    }
    async ready() {
    }
}
Button.localName = 'fyn-common-form-button';
Button.styles = ['fyn.suite.base', 'global.theme'];
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
], Button.prototype, "multi", void 0);
__decorate([
    property()
], Button.prototype, "togglable", void 0);
__decorate([
    property()
], Button.prototype, "state", void 0);
//# sourceMappingURL=button.js.map