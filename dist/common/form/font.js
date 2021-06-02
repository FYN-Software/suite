var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Font extends FormAssociated {
    constructor() {
        super(...arguments);
        this.key = '';
        this.fonts = [];
        this.variants = [];
        this._items = [];
    }
    async initialize() {
    }
    async ready() {
        this.shadow.on('#fonts', {
            change: e => {
                if (e.new !== undefined) {
                    this.variants = e.new.variants;
                }
            },
        });
        const fonts = await fetch('/node_modules/@fyn-software/suite/fonts.json').then(r => r.json());
        this._items = fonts.items.slice(0, 99);
        for (const i of this._items) {
            Fyn.Utilities.Font.preview(i);
        }
        this.fonts = Object.entries(this._items).map(([k, i]) => ({ value: k, ...i }));
    }
}
Font.localName = 'fyn-common-form-font';
Font.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Font.prototype, "key", void 0);
__decorate([
    property()
], Font.prototype, "fonts", void 0);
__decorate([
    property()
], Font.prototype, "variants", void 0);
//# sourceMappingURL=font.js.map