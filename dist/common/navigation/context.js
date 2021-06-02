var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Context extends Component {
    constructor() {
        super(...arguments);
        this.commands = [];
    }
    async initialize() {
    }
    async ready() {
        this.shadow.on({
            options: {
                passive: false,
            },
            contextmenu: e => {
                e.preventDefault();
                e.stopPropagation();
            },
        });
        this.shadow.on('fyn-common-graphics-icon', {
            click: (e, t) => {
                this.commands.reduce((t, g) => ({ ...t, ...g }), {})[t.id]?.action();
            },
        });
        window.on({ 'click|blur': this.close.bind(this) });
    }
    close() {
        this.removeAttribute('open');
    }
    static for(node, commands) {
        const inst = new this({ commands });
        globalThis.document.body.appendChild(inst);
        node.on({
            options: {
                passive: false,
            },
            contextmenu: e => {
                e.preventDefault();
                e.stopPropagation();
                inst.style.setProperty('--x', `${e.x}px`);
                inst.style.setProperty('--y', `${e.y}px`);
                inst.setAttribute('open', '');
                inst.focus();
            },
        });
        return inst;
    }
}
Context.localName = 'fyn-common-navigation-context';
Context.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Context.prototype, "commands", void 0);
//# sourceMappingURL=context.js.map