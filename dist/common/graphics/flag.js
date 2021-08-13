import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Flag extends Component {
    static localName = 'fyn-common-graphics-flag';
    static styles = ['fyn.suite.base'];
    iso = '';
    async initialize() {
    }
    async ready() {
        this.classList.add('flag-icon');
        this.observe({
            iso: (o, n) => {
                this.classList.remove(`flag-icon-${o}`);
                this.classList.add(`flag-icon-${n}`);
            },
        });
    }
}
__decorate([
    property()
], Flag.prototype, "iso", void 0);
//# sourceMappingURL=flag.js.map