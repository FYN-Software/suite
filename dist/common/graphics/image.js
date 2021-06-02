var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export var Fit;
(function (Fit) {
    Fit["auto"] = "auto";
    Fit["cover"] = "cover";
    Fit["contain"] = "contain";
})(Fit || (Fit = {}));
export default class Image extends Component {
    constructor() {
        super(...arguments);
        this.src = '';
        this.alt = '';
        this.fit = Fit.auto;
        this.loading = true;
    }
    async initialize() {
        let img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        this.observe({
            src: (o, n) => {
                if (n === undefined || n.includes('{{') || n.includes('}}') || n.includes('{#') || this.src === '') {
                    return;
                }
                this.loading = true;
                this.setAttribute('loading', '');
                this.$.img?.remove();
                img = document.createElement('img');
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    this.shadow.appendChild(img);
                    this.loading = false;
                    this.removeAttribute('loading');
                };
                img.onerror = () => {
                    this.loading = false;
                    this.removeAttribute('loading');
                };
                img.src = String(this.src);
                img.alt = this.alt ?? this.src;
                img.draggable = false;
                // TODO(Chris Kruining) change this back to property setter when typescript updates the API
                // img.part = 'img';
                this.setAttribute('part', 'img');
                img.id = 'img';
            },
            fit: async () => {
                this.shadow.setProperty('--fit', this.fit);
            },
        });
    }
    async ready() {
    }
}
Image.localName = 'fyn-common-graphics-image';
Image.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Image.prototype, "src", void 0);
__decorate([
    property()
], Image.prototype, "alt", void 0);
__decorate([
    property()
], Image.prototype, "fit", void 0);
__decorate([
    property()
], Image.prototype, "loading", void 0);
//# sourceMappingURL=image.js.map