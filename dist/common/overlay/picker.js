import { __decorate } from "tslib";
import { property } from '@fyn-software/component/decorators.js';
import Dialog from './dialog.js';
import { indexOf } from '@fyn-software/core/function/dom.js';
export default class Picker extends Dialog {
    static localName = 'fyn-common-overlay-picker';
    static styles = ['fyn.suite.base'];
    items = [];
    constructor(...args) {
        super(...args);
        this.show = this.show.bind(this);
    }
    async initialize() {
        await super.initialize();
    }
    async ready() {
        await super.ready();
        this.shadow.on('inner > main > inner > *', {
            click: (e, t) => {
                this.emit('success', this.items[indexOf(t)]);
            },
        });
    }
    async show(items = []) {
        this.items = items;
        return super.show();
    }
}
__decorate([
    property()
], Picker.prototype, "items", void 0);
//# sourceMappingURL=picker.js.map