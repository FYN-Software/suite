var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Group extends Component {
    constructor() {
        super(...arguments);
        this.label = '';
    }
    async initialize() {
    }
    async ready() {
    }
}
Group.localName = 'fyn-common-form-group';
Group.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Group.prototype, "label", void 0);
//# sourceMappingURL=group.js.map