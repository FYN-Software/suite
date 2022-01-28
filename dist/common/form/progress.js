import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property, range } from '@fyn-software/component/decorators.js';
export default class Progress extends Component {
    static localName = 'fyn-common-form-progress';
    static styles = ['fyn.suite.base'];
    steps = [];
    index = 0;
    verification = async () => true;
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
            slotchange: () => this.#detect(),
        });
        await this.#detect();
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
                if (await this.verification(a, this.pages[this.index], this.index) !== true) {
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
    async #detect() {
        await (this.index = -1);
        const pages = this.pages;
        this.steps = pages.map(s => s.getAttribute('step') ?? '-');
        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), 0));
    }
}
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