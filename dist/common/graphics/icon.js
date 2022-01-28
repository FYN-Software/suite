import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { tryParse } from '@fyn-software/core/function/json.js';
import { setAttributeOnAssert } from '@fyn-software/core/function/dom.js';
export default class Icon extends Component {
    static localName = 'fyn-common-graphics-icon';
    static styles = ['fyn.suite.base', 'fyn.suite.fontawesome'];
    #icons = [];
    type = 'fas';
    async initialize() {
        this.observe({
            icons: () => setAttributeOnAssert(this, this.#icons.length > 0, 'shown'),
        });
    }
    async ready() {
    }
    get icons() {
        return this.#icons;
    }
    set icons(v) {
        if (v === undefined || v === null || typeof v === 'boolean') {
            v = [];
        }
        if (v === '') {
            v = [];
        }
        if (Array.isArray(v) !== true && typeof v === 'string') {
            v = tryParse(v.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'")) ?? v;
        }
        if (Array.isArray(v) !== true) {
            v = [v];
        }
        this.#icons = v;
    }
}
__decorate([
    property()
], Icon.prototype, "type", void 0);
__decorate([
    property()
], Icon.prototype, "icons", null);
//# sourceMappingURL=icon.js.map