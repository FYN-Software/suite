import { __decorate } from "tslib";
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Slider extends FormAssociated {
    static localName = 'fyn-common-form-slider';
    static styles = ['fyn.suite.base'];
    step = .1;
    min = 0;
    max = 360;
    showPercentage = false;
    showValue = false;
    vertical = false;
    snaps = [];
    async initialize() {
        this.observe({
            value: (o, n) => {
                if (Number.isNaN(n)) {
                    console.trace(o, n);
                }
                const input = this.$.input;
                if (input === null) {
                    return;
                }
                input.valueAsNumber = n;
                this.emit('change', { old: o, new: n });
            },
            snaps: () => {
                this.shadow.setProperty('--list-length', this.snaps.length);
            },
        });
    }
    async ready() {
        this.shadow.on('#input', {
            change: (e, t) => this.value = t.valueAsNumber,
        });
        this.shadow.on('#input', {
            options: {
                passive: false,
            },
            input: (e, t) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.emit('input', { value: t.value });
            },
        });
    }
    valueToPercentage(value) {
        return (value - this.min) / (this.max - this.min);
    }
}
__decorate([
    property()
], Slider.prototype, "step", void 0);
__decorate([
    property({
        set(v) {
            return Math.min(Number.isNaN(v) ? this.min : v, this.max || Infinity);
        }
    })
], Slider.prototype, "min", void 0);
__decorate([
    property({
        set(v) {
            return Math.max(Number.isNaN(v) ? this.max : v, this.min || -Infinity);
        }
    })
], Slider.prototype, "max", void 0);
__decorate([
    property()
], Slider.prototype, "showPercentage", void 0);
__decorate([
    property()
], Slider.prototype, "showValue", void 0);
__decorate([
    property()
], Slider.prototype, "vertical", void 0);
__decorate([
    property()
], Slider.prototype, "snaps", void 0);
//# sourceMappingURL=slider.js.map