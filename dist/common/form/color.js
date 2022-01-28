import { __decorate } from "tslib";
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { range } from '@fyn-software/component/decorators.js';
import { contains } from '@fyn-software/core/function/rect.js';
class Hlsa {
    hue = 180;
    saturation = 0;
    lightness = .2;
    alpha = 1;
}
__decorate([
    range(0, 360)
], Hlsa.prototype, "hue", void 0);
__decorate([
    range(0, 1)
], Hlsa.prototype, "saturation", void 0);
__decorate([
    range(0, 1)
], Hlsa.prototype, "lightness", void 0);
__decorate([
    range(0, 1)
], Hlsa.prototype, "alpha", void 0);
export default class Color extends FormAssociated {
    static localName = 'fyn-common-form-color';
    static styles = ['fyn.suite.base'];
    constructor(...args) {
        super(...args);
        const value = new Hlsa;
        value.hue = 349;
        value.saturation = .63;
        value.lightness = .5;
        this.value = value;
    }
    async initialize() {
        this.observe({
            value: (o, n) => {
                const { hue, saturation, lightness, alpha } = this.value;
                console.log(this.value, hue, saturation, lightness, alpha);
                this.style.setProperty('--value', `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`);
                this.emit('change', { old: o, new: n });
            },
        });
    }
    async ready() {
        let editedValue = { ...this.value };
        this.shadow.on('value', {
            click: (_, t) => {
                editedValue = { ...this.value };
                const { hue, saturation, lightness, alpha } = editedValue;
                const rect = t.getBoundingClientRect();
                this.style.setProperty('--x', `${rect.x}px`);
                this.style.setProperty('--y', `${rect.y}px`);
                this.style.setProperty('--hue', String(hue));
                this.style.setProperty('--sat', `${saturation * 100}%`);
                this.style.setProperty('--light', `${lightness * 100}%`);
                this.style.setProperty('--alpha', String(alpha));
                this.shadow.querySelector('fyn-common-form-slider[vertical]').value = hue;
                this.shadow.querySelector('fyn-common-form-slider[horizontal]').value = 1 - alpha;
                this.setAttribute('open', '');
            },
        });
        this.shadow.on('box [action]', {
            click: (e, t) => {
                switch (t.action) {
                    case 'submit':
                        this.value = { ...editedValue };
                        break;
                }
                this.removeAttribute('open');
            },
        });
        this.shadow.on('fyn-common-form-slider[vertical]', {
            change: (_, t) => {
                editedValue.hue = t.value;
                this.style.setProperty('--hue', String(t.value));
            },
        });
        this.shadow.on('fyn-common-form-slider[horizontal]', {
            change: (_, t) => {
                editedValue.alpha = 1 - t.value;
                this.style.setProperty('--alpha', String(1 - t.value));
            },
        });
        let dragging = false;
        const box = this.shadow.querySelector('box > gradient');
        const position = (x, y) => {
            const rect = box.getBoundingClientRect();
            console.log(x, y, rect, contains(rect, x, y));
            if (contains(rect, x, y) === true) {
                editedValue.saturation = (x - rect.left) / rect.width;
                editedValue.lightness = 1 - (y - rect.top) / rect.height;
                this.style.setProperty('--sat', `${editedValue.saturation * 100}%`);
                this.style.setProperty('--light', `${editedValue.lightness * 100}%`);
            }
        };
        this.shadow.on('box > gradient', {
            options: {
                details: false,
            },
            mousedown: e => {
                dragging = true;
                position(e.x, e.y);
            }
        });
        document.body.on({
            options: {
                details: false,
            },
            mousemove: e => {
                if (dragging === true) {
                    position(e.x, e.y);
                }
            },
            mouseup: () => dragging = false,
            mouseleave: () => dragging = false,
        });
    }
}
//# sourceMappingURL=color.js.map