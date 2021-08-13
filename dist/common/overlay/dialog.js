import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export var Mode;
(function (Mode) {
    Mode[Mode["static"] = 0] = "static";
    Mode[Mode["grow"] = 1] = "grow";
})(Mode || (Mode = {}));
export default class Dialog extends Component {
    static localName = 'fyn-common-overlay-dialog';
    static styles = ['fyn.suite.base'];
    title = '';
    img = '';
    width = 0;
    height = 0;
    left = 0;
    top = 0;
    mode = Mode.grow;
    resizable = false;
    static get animations() {
        return {
            open: [
                [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }],
                {
                    duration: 300,
                    easing: 'ease-in-out',
                },
            ],
            close: [
                [],
                {
                    extend: 'open',
                    direction: 'reverse',
                },
            ],
        };
    }
    async initialize() {
    }
    async ready() {
        if (this.mode === Mode.grow) {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
        }
        this.top = document.body.offsetHeight / 2 - this.offsetHeight / 2;
        this.left = document.body.offsetWidth / 2 - this.offsetWidth / 2;
        const listener = {
            click: ({ action }) => {
                switch (action) {
                    case 'close':
                        this.close();
                        break;
                    default:
                        this.emit(action);
                        break;
                }
            },
        };
        this.shadow.on('slot[name="footer"] > [action]', listener);
        this.on('[slot="footer"][action]', listener);
    }
    async open() {
        this.style.setProperty('--x', `${Math.max(0, window.innerWidth / 2 - this.width / 2)}px`);
        this.style.setProperty('--y', `${Math.max(0, window.innerHeight / 2 - this.height / 2)}px`);
        this.style.setProperty('--w', `${Math.min(this.width, window.innerWidth)}px`);
        this.style.setProperty('--h', `${Math.min(this.height, window.innerHeight)}px`);
        return this.hasAttribute('open') === false
            ? this.animateKey('open', .25).stage(() => this.setAttribute('open', ''))
            : null;
    }
    async close() {
        return this.hasAttribute('open') === true
            ? this.animateKey('close', .25).stage(() => this.removeAttribute('open'))
            : null;
    }
    async show(modal = false) {
        let added = false;
        if (this.parentNode === null) {
            added = true;
            document.body.appendChild(this);
        }
        if (modal) {
            document.body.setAttribute('modal', '');
        }
        await this.open();
        const res = await this.await('cancel|success');
        await this.close();
        if (modal) {
            document.body.removeAttribute('modal');
        }
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
], Dialog.prototype, "width", void 0);
__decorate([
    property()
], Dialog.prototype, "height", void 0);
__decorate([
    property()
], Dialog.prototype, "left", void 0);
__decorate([
    property()
], Dialog.prototype, "top", void 0);
__decorate([
    property()
], Dialog.prototype, "mode", void 0);
__decorate([
    property()
], Dialog.prototype, "resizable", void 0);
//# sourceMappingURL=dialog.js.map