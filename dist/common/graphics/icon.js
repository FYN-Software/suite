import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Icon extends Component {
    static localName = 'fyn-common-graphics-icon';
    static styles = ['fyn.suite.base'];
    icons = [];
    type = 'fas';
    async initialize() {
        this.observe({
            icons: () => {
                this.attributes.setOnAssert(this.icons.length > 0, 'shown');
            },
        });
    }
    async ready() {
    }
}
__decorate([
    property({
        set(v) {
            if (v === undefined || v === null || typeof v === 'boolean') {
                v = [];
            }
            if (Array.isArray(v) !== true) {
                v = JSON.tryParse(v.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'"));
            }
            if (Array.isArray(v) !== true) {
                v = [v];
            }
            return v;
        }
    })
], Icon.prototype, "icons", void 0);
__decorate([
    property()
], Icon.prototype, "type", void 0);
//# sourceMappingURL=icon.js.map