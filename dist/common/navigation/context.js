import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Context extends Component {
    static localName = 'fyn-common-navigation-context';
    static styles = ['fyn.suite.base'];
    commands = [];
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
__decorate([
    property()
], Context.prototype, "commands", void 0);
//# sourceMappingURL=context.js.map