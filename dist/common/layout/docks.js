import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { setAttributeOnAssert } from '@fyn-software/core/function/dom.js';
export var Resize;
(function (Resize) {
    Resize[Resize["none"] = 0] = "none";
    Resize[Resize["inline"] = 1] = "inline";
    Resize[Resize["block"] = 2] = "block";
})(Resize || (Resize = {}));
export default class Docks extends Component {
    static localName = 'fyn-common-layout-docks';
    static styles = ['fyn.suite.base'];
    grid = '';
    cells = [];
    closable = false;
    async initialize() {
    }
    async ready() {
        this.shadow.on('fyn-common-layout-tabs.docked', {
            switched: ({ index }, t) => {
                setAttributeOnAssert(t, index > -1, 'open');
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
}
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