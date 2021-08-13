import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class List extends Component {
    static localName = 'fyn-common-layout-list';
    static styles = ['fyn.suite.base'];
    sortable = false;
    async initialize() {
    }
    async ready() {
        this.observe({
            sortable: () => this.items.forEach(i => i.draggable = this.sortable),
        });
        this.shadow.on('slot', {
            slotchange: () => this.items.forEach(i => i.draggable = this.sortable),
        });
    }
    get items() {
        const slot = this.shadow.querySelector('slot');
        return slot !== null
            ? slot.assignedElements({ flatten: true })
            : [];
    }
}
__decorate([
    property()
], List.prototype, "sortable", void 0);
//# sourceMappingURL=list.js.map