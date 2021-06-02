var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Icon extends Component {
    constructor() {
        super(...arguments);
        this.icons = [];
        this.type = 'fas';
    }
    async initialize() {
        this.observe({
            icons: (o, n) => {
                // console.log(o, n);
                //
                // if(o?.length > 0 && n.length === 0)
                // {
                //     console.trace('WHY?!');
                // }
            },
        });
    }
    async ready() {
    }
}
Icon.localName = 'fyn-common-graphics-icon';
Icon.styles = ['fyn.suite.base', 'fyn.suite.fontawesome', 'global.theme'];
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