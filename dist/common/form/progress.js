var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property, range } from '@fyn-software/component/decorators.js';
export default class Progress extends Component {
    constructor() {
        super(...arguments);
        this.steps = [];
        this.index = 0;
    }
    async initialize() {
        this.observe({
            index: async (o, n) => {
                if (this.index < 0 || this.index >= this.steps.length) {
                    return;
                }
                const pages = this.pages;
                pages.forEach(t => t.removeAttribute('active'));
                pages[this.index].setAttribute('active', '');
                const main = this.shadow.querySelector('main');
                main.scrollTo({
                    left: Math.floor(main.scrollWidth * (this.index / this.steps.length)),
                    behavior: 'smooth',
                });
            },
        });
        this.shadow.on('main > slot', {
            slotchange: async () => {
                await (this.index = -1);
                const pages = this.pages;
                this.steps = pages.map(s => s.getAttribute('step') ?? '-');
                await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), 0));
            },
        });
    }
    async ready() {
        this.shadow.on({
            options: {
                passive: false,
            },
            wheel: (e) => {
                if (e.shiftKey) {
                    e.preventDefault();
                }
            },
        });
        this.shadow.on('footer > [action]', {
            click: async ({ action }) => {
                const a = action === 'next' || action === 'submit'
                    ? 'submit'
                    : 'cancel';
                if (await this.verification?.invoke(a, this.pages[this.index], this.index) !== true) {
                    return;
                }
                switch (action) {
                    case 'next':
                        {
                            this.index = Math.min(this.steps.length - 1, this.index + 1);
                            break;
                        }
                    case 'previous':
                        {
                            this.index = Math.max(0, this.index - 1);
                            break;
                        }
                    case 'submit':
                        {
                            this.emit('submit');
                            break;
                        }
                    case 'cancel':
                        {
                            this.emit('cancel');
                            break;
                        }
                }
            },
            wheel: (e, t) => console.log(e, t),
        });
    }
    get pages() {
        const slot = this.shadow.querySelector('main > slot');
        if (slot === null) {
            return [];
        }
        return slot.assignedElements({ flatten: true });
    }
}
Progress.localName = 'fyn-common-form-progress';
Progress.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Progress.prototype, "steps", void 0);
__decorate([
    property(),
    range(-1)
], Progress.prototype, "index", void 0);
__decorate([
    property()
], Progress.prototype, "verification", void 0);
//# sourceMappingURL=progress.js.map