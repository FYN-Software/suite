var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Slider extends FormAssociated {
    constructor() {
        super(...arguments);
        this.step = .1;
        this.min = 0;
        this.max = 360;
        this.showPercentage = false;
        this.showValue = false;
        this.vertical = false;
        this.snaps = [];
    }
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
Slider.localName = 'fyn-common-form-slider';
Slider.styles = ['fyn.suite.base', 'global.theme'];
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