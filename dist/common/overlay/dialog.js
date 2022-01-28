import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Dialog extends Component {
    static localName = 'fyn-common-overlay-dialog';
    static styles = ['fyn.suite.base'];
    title = '';
    img = '';
    inlineSize = 0;
    blockSize = 0;
    insetInlineStart = 0;
    insetBlockStart = 0;
    resizable = false;
    async initialize() {
    }
    async ready() {
        this.insetBlockStart = document.body.offsetHeight / 2 - this.offsetHeight / 2;
        this.insetInlineStart = document.body.offsetWidth / 2 - this.offsetWidth / 2;
        const listener = {
            click: ({ action }) => {
                switch (action) {
                    case 'close':
                        {
                            this.close();
                            break;
                        }
                    default:
                        {
                            this.emit(action);
                            break;
                        }
                }
            },
        };
        this.shadow.on('slot[name="footer"] > [action]', listener);
        this.on('[slot="footer"][action]', listener);
    }
    async open() {
        this.style.setProperty('--inset-inline-start', `${Math.max(0, window.innerWidth / 2 - this.inlineSize / 2)}px`);
        this.style.setProperty('--inset-block-start', `${Math.max(0, window.innerHeight / 2 - this.blockSize / 2)}px`);
        this.style.setProperty('--inline-size', `${Math.min(this.inlineSize, window.innerWidth)}px`);
        this.style.setProperty('--block-size', `${Math.min(this.blockSize, window.innerHeight)}px`);
        this.setAttribute('open', '');
        for (const node of this.childNodes) {
            node.emit('shown');
        }
        this.emit('shown');
    }
    async close() {
        this.removeAttribute('open');
        for (const node of this.childNodes) {
            node.emit('closed');
        }
        this.emit('closed');
    }
    async show() {
        let added = false;
        if (this.parentNode === null) {
            added = true;
            document.body.appendChild(this);
        }
        await this.open();
        const res = await Promise.race([
            this.await('success'),
            this.await('cancel').then(() => false),
        ]);
        await this.close();
        if (added) {
            document.body.removeChild(this);
        }
        return res;
    }
}
__decorate([
    property()
], Dialog.prototype, "title", void 0);
__decorate([
    property()
], Dialog.prototype, "img", void 0);
__decorate([
    property()
], Dialog.prototype, "inlineSize", void 0);
__decorate([
    property()
], Dialog.prototype, "blockSize", void 0);
__decorate([
    property()
], Dialog.prototype, "insetInlineStart", void 0);
__decorate([
    property()
], Dialog.prototype, "insetBlockStart", void 0);
__decorate([
    property()
], Dialog.prototype, "resizable", void 0);
//# sourceMappingURL=dialog.js.map