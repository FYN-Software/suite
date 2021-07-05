var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Media, { Preference } from '@fyn-software/core/media.js';
export var Fit;
(function (Fit) {
    Fit["auto"] = "auto";
    Fit["cover"] = "cover";
    Fit["contain"] = "contain";
})(Fit || (Fit = {}));
export default class Image extends Component {
    constructor() {
        super(...arguments);
        this.loading = false;
        this.insecure = false;
        this.alt = '';
        this.fit = Fit.contain;
        this.src = '';
    }
    async initialize() {
        this.observe({
            src: async (o, n) => {
                if (n === undefined || n === '' || Media.prefers(Preference.reducedData)) {
                    return;
                }
                this.loading = true;
                this.$.img?.remove();
                await Promise.delay(0);
                const img = document.createElement('img');
                img.onload = () => {
                    this.shadow.appendChild(img);
                    this.loading = false;
                };
                img.onerror = () => {
                    this.loading = false;
                };
                img.alt = this.alt ?? this.src;
                img.draggable = false;
                img.setAttribute('part', 'img');
                img.id = 'img';
                if (this.insecure !== true) {
                    img.crossOrigin = 'anonymous';
                }
                img.src = String(this.src);
            },
            alt: () => {
                if (Media.prefers(Preference.reducedData) === false) {
                    return;
                }
                this.shadow.textContent = this.alt;
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
], Image.prototype, "loading", void 0);
__decorate([
    property()
], Image.prototype, "insecure", void 0);
__decorate([
    property()
], Image.prototype, "alt", void 0);
__decorate([
    property({ bindToCSS: v => String(v) })
], Image.prototype, "fit", void 0);
__decorate([
    property()
], Image.prototype, "src", void 0);
//# sourceMappingURL=image.js.map