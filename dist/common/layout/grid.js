import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Grid extends Component {
    static localName = 'fyn-common-layout-grid';
    static styles = ['fyn.suite.base'];
    grid = '';
    cells = [];
    async initialize() {
        this.observe({
            grid: () => this.style.setProperty('--grid', this.grid),
        });
    }
    async ready() {
    }
}
__decorate([
    property()
], Grid.prototype, "grid", void 0);
__decorate([
    property()
], Grid.prototype, "cells", void 0);
//# sourceMappingURL=grid.js.map