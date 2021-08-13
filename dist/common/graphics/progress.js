import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Progress extends Component {
    static localName = 'fyn-common-graphics-progress';
    static styles = ['fyn.suite.base'];
    value = 0;
    async initialize() {
    }
    async ready() {
        this.observe({
            value: (o, n) => {
                this.shadow.querySelector('value').style.width = `${n * 100}%`;
            },
        });
    }
}
__decorate([
    property()
], Progress.prototype, "value", void 0);
//# sourceMappingURL=progress.js.map