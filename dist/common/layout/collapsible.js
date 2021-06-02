var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Collapsible extends Component {
    constructor() {
        super(...arguments);
        this.icons = '';
        this.title = '';
    }
    async initialize() {
        return Promise.resolve(undefined);
    }
    async ready() {
        this.shadow.on('[title], fyn-common-graphics-icon', {
            click: () => {
                this.attributes.toggle('closed');
                this.emit('toggle', { open: this.hasAttribute('closed') === false });
            },
        });
    }
    get open() {
        return this.hasAttribute('closed') === false;
    }
}
Collapsible.localName = 'fyn-common-layout-collapsible';
Collapsible.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Collapsible.prototype, "icons", void 0);
__decorate([
    property()
], Collapsible.prototype, "title", void 0);
//# sourceMappingURL=collapsible.js.map