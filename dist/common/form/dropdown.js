import { __decorate } from "tslib";
import { equals } from '@fyn-software/core/extends.js';
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
import Container from '@fyn-software/component/container.js';
export default class Dropdown extends FormAssociated {
    static localName = 'fyn-common-form-dropdown';
    static styles = ['fyn.suite.base'];
    _options = [];
    _container = new Container(() => document.createElement('options'));
    options = [];
    index = -1;
    search = '';
    placeholder = '';
    filterable = false;
    filter = async (f, o) => Object.values(o).some(v => typeof v === 'string' && v.toLowerCase().includes(f));
    async initialize() {
        this.observe({
            options: async () => {
                await this._update();
                this.index = this._findIndex(this.value);
            },
            index: (o, n) => {
                this.emit('change', { old: this.options[o], new: this.options[n] });
                this._renderValue();
            },
            value: (o, n) => {
                this.index = this._findIndex(n);
            },
            filter: async () => await this._update(),
            search: async () => await this._update(),
        });
    }
    async ready() {
        this._container.shadow.on('options > *', {
            click: (_, t) => {
                this.index = t.index;
                this.removeAttribute('open');
            },
        });
        const node = this._container.shadow.querySelector('options');
        node.on({
            rendered: async (_, t) => {
                await (this.index = this._findIndex(this.value));
                this._renderValue();
            },
        });
        document.body.appendChild(this._container);
        const positionContainer = () => {
            const rect = this.getBoundingClientRect();
            this._container.style.setProperty('--x', `${rect.x}px`);
            this._container.style.setProperty('--y', `${rect.bottom}px`);
            this._container.style.setProperty('--w', `${rect.width}px`);
            this._container.style.setProperty('--h', `${Math.clamp(50, 500, globalThis.innerHeight - rect.bottom)}px`);
        };
        this.shadow.on('fyn-common-form-button', {
            click: (_, t) => {
                positionContainer();
                this._container.attributes.toggle('open');
                this.attributes.toggle('open');
                if (this.filterable === true) {
                    t.querySelector('fyn-common-form-input').focus();
                }
            },
        });
        positionContainer();
        this.shadow.on('fyn-common-form-button > fyn-common-form-input', {
            change: ({ new: n }) => this.search = n,
        });
        document.body.on({
            click: (e, t) => {
                this._container.removeAttribute('open');
                this.removeAttribute('open');
            },
        });
        window.on({
            blur: () => {
                this._container.removeAttribute('open');
                this.removeAttribute('open');
            },
        });
    }
    get optionElements() {
        return Array.from(this._container.shadow.querySelectorAll('options > *'));
    }
    _renderValue() {
        const c = this.shadow.querySelector('fyn-common-form-button > value');
        c.childNodes.clear();
        for (const i of Array.from(this._container.shadow.querySelectorAll(`options > *`)).filter(i => i.index === this.index)) {
            c.appendChild(i.cloneNode(true));
        }
        this._setWidth();
    }
    _setWidth() {
        const placeholder = this.shadow.querySelector('fyn-common-form-button > value');
        const width = Math.max(placeholder?.clientWidth ?? 0, ...this.optionElements.map(o => o.clientWidth));
        this.shadow.setProperty('--min-width', `${width}px`);
    }
    async _update() {
        this._options = await this.options.filterAsync(async (o) => this.search.length === 0 || await this.filter(this.search, o));
    }
    _findIndex(value) {
        return this.options.findIndex(o => equals(o, value));
    }
}
__decorate([
    property()
], Dropdown.prototype, "options", void 0);
__decorate([
    property()
], Dropdown.prototype, "index", void 0);
__decorate([
    property()
], Dropdown.prototype, "search", void 0);
__decorate([
    property()
], Dropdown.prototype, "placeholder", void 0);
__decorate([
    property()
], Dropdown.prototype, "filterable", void 0);
__decorate([
    property()
], Dropdown.prototype, "filter", void 0);
//# sourceMappingURL=dropdown.js.map