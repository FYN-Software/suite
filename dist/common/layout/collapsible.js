import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { toggleAttribute } from '@fyn-software/core/function/dom.js';
export default class Collapsible extends Component {
    static localName = 'fyn-common-layout-collapsible';
    static styles = ['fyn.suite.base'];
    icons = '';
    title = '';
    async initialize() {
        return Promise.resolve(undefined);
    }
    async ready() {
        this.shadow.on('[title], fyn-common-graphics-icon', {
            click: () => {
                toggleAttribute(this, 'closed');
                this.emit('toggle', { open: this.hasAttribute('closed') === false });
            },
        });
    }
    get open() {
        return this.hasAttribute('closed') === false;
    }
}
__decorate([
    property()
], Collapsible.prototype, "icons", void 0);
__decorate([
    property()
], Collapsible.prototype, "title", void 0);
//# sourceMappingURL=collapsible.js.map