import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export const Size = {
    normal: { x: 4, y: 3 },
    square: { x: 1, y: 1 },
};
export default class Flag extends Component {
    static localName = 'fyn-common-graphics-flag';
    static styles = ['fyn.suite.base'];
    iso = '';
    size = Size.normal;
    async initialize() {
    }
    async ready() {
    }
}
__decorate([
    property()
], Flag.prototype, "iso", void 0);
__decorate([
    property()
], Flag.prototype, "size", void 0);
//# sourceMappingURL=flag.js.map