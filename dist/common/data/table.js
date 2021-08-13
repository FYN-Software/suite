import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export default class Table extends Component {
    static localName = 'fyn-common-data-table';
    static styles = ['fyn.suite.base'];
    headers = [];
    rows = [];
    select = Select.none;
    templates = [];
    selection = [1];
    async initialize() {
        this.observe({
            select: (o, n) => {
                this._setColumns();
                this.selection = {
                    [Select.none]: [],
                    [Select.single]: this.selection.slice(0, 1),
                    [Select.multiple]: this.selection,
                }[n];
            },
            headers: (o, n) => {
                this._setColumns();
            },
            rows: (o, n) => {
                this.headers = n.reduce((t, r) => [...t, ...Object.keys(r)], []).unique();
            },
            selection: (o, n) => {
                this.$.selectAll.checked = {
                    [Array.from(this.rows.keys()).length]: true,
                    [0]: false,
                }[n.length] ?? null;
            },
        });
    }
    async ready() {
        this.shadow.on('_selectAll', {
            click: (e, t) => {
                if (this.select !== Select.multiple) {
                    return;
                }
                this.selection = t.checked === true
                    ? Array.from(this.rows.keys())
                    : [];
            },
        });
        this.shadow.on('[id|="row"]', {
            click: (e, t) => {
                const index = t.parentElement?.parentElement?.index ?? -1;
                switch (this.select) {
                    case Select.multiple:
                        {
                            this.selection = t.checked === true
                                ? [...this.selection, index]
                                : this.selection.filter(i => i !== index);
                            return;
                        }
                    case Select.single:
                        {
                            this.selection = t.checked === true
                                ? [index]
                                : [];
                            return;
                        }
                    case Select.none:
                    default:
                        {
                            return;
                        }
                }
            },
        });
    }
    get Select() {
        return Select;
    }
    async *selectedRows() {
        for (const index of this.selection) {
            yield this.rows[index];
        }
    }
    _setColumns() {
        this.shadow.setProperty('--columns', `${this.select === Select.none ? '' : 'auto'} repeat(${this.headers.length}, 1fr)`);
    }
}
__decorate([
    property()
], Table.prototype, "headers", void 0);
__decorate([
    property()
], Table.prototype, "rows", void 0);
__decorate([
    property()
], Table.prototype, "select", void 0);
__decorate([
    property()
], Table.prototype, "templates", void 0);
__decorate([
    property()
], Table.prototype, "selection", void 0);
//# sourceMappingURL=table.js.map