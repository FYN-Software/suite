import { equals } from '@fyn-software/core/extends.js';
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
import Template from '@fyn-software/component/template.js';
import Container from '@fyn-software/component/container.js';
import For from '@fyn-software/component/directive/for.js';
import Input from './input.js';

export default class Dropdown<TValue = any> extends FormAssociated<Dropdown<TValue>, TValue>
{
    static localName = 'fyn-common-form-dropdown';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    private _options: Array<TValue> = [];
    private _container = new Container('<options></options>');

    @property()
    public options: Array<TValue> = [];

    @property()
    public index: number = -1;

    @property()
    public search: string = '';

    @property()
    public placeholder: string = '';

    @property()
    public filterable: boolean = false;

    @property()
    public filter: (filter: string, option: TValue) => Promise<boolean> =
        async (f: string, o: TValue) => Object.values(o).some(v => typeof v === 'string' && v.toLowerCase().includes(f));

    protected async initialize(): Promise<void>
    {
        this.shadow.on<HTMLSlotElement>('#templateContainer', {
            slotchange: async (e, slot) => {
                this._optionsForDirective.fragment = await Template.scanSlot(slot, ['option']);
            },
        });

        this.observe({
            options: async () => {
                await this._update();

                this.index = this._findIndex(this.value);
            },
            index: (o: number, n: number) => {
                this.emit('change', { old: this.options[o], new: this.options[n] });

                this._renderValue();
            },
            value: (o: TValue, n: TValue) => {
                this.index = this._findIndex(n);
            },
            filter: async () => await this._update(),
            search: async () => await this._update(),
        });
    }

    protected async ready(): Promise<void>
    {
        this._container.shadow.adoptedStyleSheets = [ ...this._container.shadow.adoptedStyleSheets, this.shadow.style ];
        this._container.shadow.on('options > *', {
            click: (_, t) => {
                this.index = t.index;

                this.removeAttribute('open');
            },
        });

        const node = this._container.shadow.querySelector('options')!;
        this._optionsForDirective.transferTo(node);
        node.on({
            rendered: async (_, t) => {
                await (this.index = this._findIndex(this.value));

                this._renderValue();
            },
        })

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

                if(this.filterable === true)
                {
                    t.querySelector<Input>('fyn-common-form-input')!.focus();
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

    get optionElements()
    {
        return Array.from(this._container.shadow.querySelectorAll('options > *'));
    }

    get _optionsForDirective(): For<Dropdown<TValue>>
    {
        return Template.getDirectivesFor(this.shadow.querySelector('options')!)![':for'] as For<Dropdown<TValue>>;
    }

    _renderValue(): void
    {
        const c = this.shadow.querySelector('fyn-common-form-button > value')!;
        c.childNodes.clear();

        for(const i of Array.from(this._container.shadow.querySelectorAll(`options > *`)).filter(i => i.index === this.index))
        {
            c.appendChild(i.cloneNode(true))
        }

        this._setWidth();
    }

    _setWidth(): void
    {
        const placeholder = this.shadow.querySelector('fyn-common-form-button > value');
        const width = Math.max(
            placeholder?.clientWidth ?? 0,
            ...this.optionElements.map(o => o.clientWidth),
        );

        this.shadow.setProperty('--min-width', `${width}px`);
    }

    async _update(): Promise<void>
    {
        this._options = await this.options.filterAsync(
            async o => this.search.length === 0 || await this.filter(this.search, o)
        );
    }

    _findIndex(value: TValue): number
    {
        return this.options.findIndex(o => equals(o, value));
    }
}