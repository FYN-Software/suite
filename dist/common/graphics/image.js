import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Media, { Preference } from '@fyn-software/core/media.js';
export var Fit;
(function (Fit) {
    Fit["auto"] = "auto";
    Fit["cover"] = "cover";
    Fit["contain"] = "contain";
})(Fit || (Fit = {}));
export var Position;
(function (Position) {
    Position["start"] = "left";
    Position["center"] = "center";
    Position["end"] = "right";
})(Position || (Position = {}));
export default class Image extends Component {
    static localName = 'fyn-common-graphics-image';
    static styles = ['fyn.suite.base'];
    loading = false;
    insecure = false;
    alt = '';
    fit = Fit.contain;
    position = Position.center;
    src = '';
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
    property({ bindToCSS: v => String(v) })
], Image.prototype, "position", void 0);
__decorate([
    property()
], Image.prototype, "src", void 0);
//# sourceMappingURL=image.js.map