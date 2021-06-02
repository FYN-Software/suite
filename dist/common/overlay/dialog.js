var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export var Mode;
(function (Mode) {
    Mode[Mode["static"] = 0] = "static";
    Mode[Mode["grow"] = 1] = "grow";
})(Mode || (Mode = {}));
export default class Dialog extends Component {
    constructor() {
        super(...arguments);
        this.title = '';
        this.img = '';
        this.width = 0;
        this.height = 0;
        this.left = 0;
        this.top = 0;
        this.mode = Mode.grow;
        this.resizable = false;
    }
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
Dialog.localName = 'fyn-common-overlay-dialog';
Dialog.styles = ['fyn.suite.base', 'global.theme'];
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