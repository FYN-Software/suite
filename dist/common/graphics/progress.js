var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Progress extends Component {
    constructor() {
        super(...arguments);
        this.value = 0;
    }
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
Progress.localName = 'fyn-common-graphics-progress';
Progress.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property() //.min(0).max(1)
], Progress.prototype, "value", void 0);
//# sourceMappingURL=progress.js.map