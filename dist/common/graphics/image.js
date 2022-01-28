import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { prefers, Preference } from '@fyn-software/core/media.js';
import { delay } from '@fyn-software/core/function/promise.js';
import { clamp, mod, range } from '@fyn-software/core/function/number.js';
import { when } from '@fyn-software/core/function/common.js';
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
    filterColor;
    async initialize() {
        this.observe({
            src: async () => {
                if (this.src === undefined || this.src === '' || prefers(Preference.reducedData)) {
                    return;
                }
                this.loading = true;
                this.$.img?.remove();
                await delay(0);
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
                if (prefers(Preference.reducedData) === false) {
                    return;
                }
                this.shadow.textContent = this.alt;
            },
            filterColor: () => {
                if (this.filterColor === undefined) {
                    return;
                }
                this.style.setProperty('--color', this.filterColor);
                const [, r, g, b] = getComputedStyle(this).getPropertyValue('--color').match(/rgb\( *(\d+), *(\d+), *(\d+)\)/);
                const color = new Color(Number.parseInt(r), Number.parseInt(g), Number.parseInt(b));
                const solver = new Solver(color);
                const result = solver.solve();
                this.style.setProperty('filter', result.filter);
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
__decorate([
    property()
], Image.prototype, "filterColor", void 0);
class Color {
    #r;
    #g;
    #b;
    constructor(r, g, b) {
        this.set(r, g, b);
    }
    toString() {
        return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
    }
    set(r, g, b) {
        this.#r = clamp(r, 0, 255);
        this.#g = clamp(g, 0, 255);
        this.#b = clamp(b, 0, 255);
    }
    hueRotate(angle = 0) {
        angle = angle / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        this.multiply([
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
        ]);
    }
    grayscale(value = 1) {
        this.multiply([
            0.2126 + 0.7874 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 + 0.2848 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 + 0.9278 * (1 - value),
        ]);
    }
    sepia(value = 1) {
        this.multiply([
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value),
        ]);
    }
    saturate(value = 1) {
        this.multiply([
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value,
        ]);
    }
    multiply(matrix) {
        const newR = clamp(this.#r * matrix[0] + this.#g * matrix[1] + this.#b * matrix[2], 0, 255);
        const newG = clamp(this.#r * matrix[3] + this.#g * matrix[4] + this.#b * matrix[5], 0, 255);
        const newB = clamp(this.#r * matrix[6] + this.#g * matrix[7] + this.#b * matrix[8], 0, 255);
        this.#r = newR;
        this.#g = newG;
        this.#b = newB;
    }
    brightness(value = 1) {
        this.linear(value);
    }
    contrast(value = 1) {
        this.linear(value, -(0.5 * value) + 0.5);
    }
    linear(slope = 1, intercept = 0) {
        this.#r = clamp(this.#r * slope + intercept * 255, 0, 255);
        this.#g = clamp(this.#g * slope + intercept * 255, 0, 255);
        this.#b = clamp(this.#b * slope + intercept * 255, 0, 255);
    }
    invert(value = 1) {
        this.#r = clamp((value + this.#r / 255 * (1 - 2 * value)) * 255, 0, 255);
        this.#g = clamp((value + this.#g / 255 * (1 - 2 * value)) * 255, 0, 255);
        this.#b = clamp((value + this.#b / 255 * (1 - 2 * value)) * 255, 0, 255);
    }
    get r() {
        return this.#r;
    }
    get g() {
        return this.#g;
    }
    get b() {
        return this.#b;
    }
    get hsl() {
        const r = this.#r / 255;
        const g = this.#g / 255;
        const b = this.#b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = when(max)
                .is(r, () => (g - b) / d + (g < b ? 6 : 0))
                .is(g, () => (b - r) / d + 2)
                .is(b, () => (r - g) / d + 4)
                / 6;
        }
        return {
            h: h * 100,
            s: s * 100,
            l: l * 100,
        };
    }
}
var Filter;
(function (Filter) {
    Filter[Filter["Invert"] = 0] = "Invert";
    Filter[Filter["Sepia"] = 1] = "Sepia";
    Filter[Filter["Saturate"] = 2] = "Saturate";
    Filter[Filter["HueRotate"] = 3] = "HueRotate";
    Filter[Filter["Brightness"] = 4] = "Brightness";
    Filter[Filter["Contrast"] = 5] = "Contrast";
})(Filter || (Filter = {}));
class Solver {
    static #wideIterations = 1000;
    static #narrowIterations = 500;
    #target;
    #targetHSL;
    #reusedColor = new Color(0, 0, 0);
    constructor(target) {
        this.#target = target;
        this.#targetHSL = target.hsl;
    }
    solve() {
        const result = this.solveNarrow(this.solveWide());
        return { ...result, filter: this.css(result.values) };
    }
    solveWide() {
        const loss = 5;
        const c = 15;
        const values = [60, 180, 18000, 600, 1.2, 1.2];
        let best = { loss: Infinity };
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(loss, values, c, initial, Solver.#wideIterations);
            if (result.loss < best.loss) {
                best = result;
            }
        }
        return best;
    }
    solveNarrow(wide) {
        const loss = wide.loss;
        const c = 2;
        const lossFactor = loss + 1;
        const values = [0.25 * lossFactor, 0.25 * lossFactor, lossFactor, 0.25 * lossFactor, 0.2 * lossFactor, 0.2 * lossFactor];
        return this.spsa(loss, values, c, wide.values, Solver.#narrowIterations);
    }
    spsa(initialLoss, values, c, initialValues, iterations) {
        const alpha = 1;
        const gamma = 0.16666666666666666;
        let best = undefined;
        let bestLoss = Infinity;
        const deltas = new Array(6);
        const highArgs = new Array(6);
        const lowArgs = new Array(6);
        for (let i = 0; i < iterations; i++) {
            const ck = c / Math.pow(i + 1, gamma);
            for (const filter of range(0, 6)) {
                deltas[filter] = Math.random() > 0.5
                    ? 1
                    : -1;
                highArgs[filter] = initialValues[filter] + ck * deltas[filter];
                lowArgs[filter] = initialValues[filter] - ck * deltas[filter];
            }
            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (const filter of range(0, 6)) {
                const g = lossDiff / (2 * ck) * deltas[filter];
                const ak = values[filter] / Math.pow(initialLoss + i + 1, alpha);
                initialValues[filter] = Solver.#fix(initialValues[filter] - ak * g, filter);
            }
            const loss = this.loss(initialValues);
            if (loss < bestLoss) {
                best = initialValues.slice(0);
                bestLoss = loss;
            }
        }
        if (best === undefined) {
            throw new Error('could not calculate the values');
        }
        return { values: best, loss: bestLoss };
    }
    loss(filters) {
        const color = this.#reusedColor;
        color.set(0, 0, 0);
        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100);
        color.hueRotate(filters[3] * 3.6);
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100);
        const colorHSL = color.hsl;
        return (Math.abs(color.r - this.#target.r) +
            Math.abs(color.g - this.#target.g) +
            Math.abs(color.b - this.#target.b) +
            Math.abs(colorHSL.h - this.#targetHSL.h) +
            Math.abs(colorHSL.s - this.#targetHSL.s) +
            Math.abs(colorHSL.l - this.#targetHSL.l));
    }
    css(filters) {
        const f = (idx, multiplier = 1) => Math.round(filters[idx] * multiplier);
        return `invert(${f(0)}%) sepia(${f(1)}%) saturate(${f(2)}%) hue-rotate(${f(3, 3.6)}deg) brightness(${f(4)}%) contrast(${f(5)}%)`;
    }
    static #fix(value, idx) {
        const max = idx === Filter.Saturate
            ? 7500
            : idx === Filter.Brightness || idx === Filter.Contrast
                ? 200
                : 100;
        if (idx === Filter.HueRotate) {
            return mod(value, max);
        }
        return clamp(value, 0, max);
    }
}
//# sourceMappingURL=image.js.map