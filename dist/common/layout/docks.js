var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { Position } from './tabs.js';
export var Resize;
(function (Resize) {
    Resize[Resize["none"] = 0] = "none";
    Resize[Resize["inline"] = 1] = "inline";
    Resize[Resize["block"] = 2] = "block";
})(Resize || (Resize = {}));
export default class Docks extends Component {
    constructor() {
        super(...arguments);
        this.grid = '';
        this.cells = [];
        this.closable = false;
    }
    async initialize() {
    }
    async ready() {
        this.shadow.on('fyn-common-layout-tabs.docked', {
            switched: ({ index }, t) => {
                t.attributes.setOnAssert(index > -1, 'open');
            },
        });
    }
    async add(cell, element, title, closable) {
        if (cell < 0 || cell >= this.cells.length) {
            throw new Error(`The cell given is not within a valid range`);
        }
        element.setAttribute('slot', String(cell));
        element.setAttribute('tab-title', title);
        element.setAttribute('tab-closable', String(closable));
        this.appendChild(element);
        void element.getBoundingClientRect();
        await this.isReady;
        const tabs = this.$[cell];
        tabs.index = tabs.tabs.length - 1;
    }
    get Position() {
        return Position;
    }
    get Resize() {
        return Resize;
    }
}
Docks.localName = 'fyn-common-layout-docks';
Docks.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Docks.prototype, "grid", void 0);
__decorate([
    property()
], Docks.prototype, "cells", void 0);
__decorate([
    property()
], Docks.prototype, "closable", void 0);
//# sourceMappingURL=docks.js.map