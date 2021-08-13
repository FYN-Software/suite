import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Item extends Component {
    static localName = 'fyn-common-navigation-item';
    static styles = ['fyn.suite.base'];
    route = '';
    icon = '';
    async initialize() {
    }
    async ready() {
    }
}
__decorate([
    property()
], Item.prototype, "route", void 0);
__decorate([
    property()
], Item.prototype, "icon", void 0);
//# sourceMappingURL=item.js.map