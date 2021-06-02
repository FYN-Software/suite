var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Grid extends Component {
    constructor() {
        super(...arguments);
        this.grid = '';
        this.cells = [];
    }
    async initialize() {
        this.observe({
            grid: () => this.style.setProperty('--grid', this.grid),
        });
    }
    async ready() {
    }
}
Grid.localName = 'fyn-common-layout-grid';
Grid.styles = ['fyn.suite.base', 'global.theme'];
__decorate([
    property()
], Grid.prototype, "grid", void 0);
__decorate([
    property()
], Grid.prototype, "cells", void 0);
//# sourceMappingURL=grid.js.map