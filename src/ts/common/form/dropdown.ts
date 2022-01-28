import { clamp } from '@fyn-software/core/function/number.js';
import { equals } from '@fyn-software/core/function/common.js';
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
import Container from '@fyn-software/component/container.js';
import Input  from './input.js';
import Button from './button.js';
import { getDirective, hydrate, processBindings } from '@fyn-software/component/template.js';
import For from '@fyn-software/component/directive/for.js';
import { filterAsync } from '@fyn-software/core/function/array.js';
import { indexOf, toggleAttribute } from '@fyn-software/core/function/dom.js';

type DropdownEvents<TValue> = {
    change: { old: TValue, new: TValue };
};

export default class Dropdown<TValue = any> extends FormAssociated<Dropdown<TValue>, DropdownEvents<TValue>, TValue>
{
    static readonly localName = 'fyn-common-form-dropdown';
    static readonly styles = [ 'fyn.suite.base' ];

    @property()
    private _internalOptions: Array<TValue> = [];

    #container = new Container(() => document.createElement('options'));
    #bindings: Array<IBinding<any>> = [];

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
        this.observe({
            options: async () => {
                if(this.options === undefined)
                {
                    return;
                }

                await this.#update();

                this.index = this.#findIndex(this.value);
            },
            index: (o: number, n: number) => {
                if(this.options === undefined)
                {
                    return;
                }

                this.emit('change', { old: this.options[o], new: this.options[n] }, { composed: true });

                this.#renderValue();
            },
            value: (o: TValue, n: TValue) => {
                this.index = this.#findIndex(this.value);
            },
            filter: async () => await this.#update(),
            search: async () => await this.#update(),
        });
    }

    protected async ready(): Promise<void>
    {
        this.#container.shadow.appendChild(this.shadow.querySelector<HTMLStyleElement>('style')!.cloneNode(true));
        this.#container.shadow.on('options > *', {
            click: (_, t) => {
                this.index = this.#findIndex(this._internalOptions[indexOf(t) ?? -1]);

                this.removeAttribute('open');
            },
        });
        document.body.appendChild(this.#container);

        const node = this.#container.shadow.querySelector('options')!;
        node.on({
            rendered: () => this.#renderValue(),
        });

        const forDirective = getDirective<For>(For, this.shadow.querySelector('options')!)!;
        forDirective.transferTo(node);
        forDirective.on({
            templateChange: template => this.#updateTemplate(template),
        });
        await this.#updateTemplate(forDirective.fragment);

        const positionContainer = () => {
            const rect = this.getBoundingClientRect();

            this.#container.style.setProperty('--x', `${rect.x}px`);
            this.#container.style.setProperty('--y', `${rect.bottom}px`);
            this.#container.style.setProperty('--w', `${rect.width}px`);
            this.#container.style.setProperty('--h', `${clamp(50, 500, globalThis.innerHeight - rect.bottom)}px`);
        };

        this.on({
            '#rendered': () => {
                positionContainer();
            },
        });

        this.shadow.on<Button>('fyn-common-form-button', {
            click: (_, t) => {
                positionContainer();

                toggleAttribute(this.#container, 'open');
                toggleAttribute(this, 'open');

                if(this.filterable === true)
                {
                    t.querySelector<Input>('fyn-common-form-input')!.focus();
                }
            },
        });

        this.shadow.on<Input>('fyn-common-form-button > fyn-common-form-input', {
            change: ({ new: n }) => this.search = n,
        });

        document.body.on({
            click: () => {
                this.#container.removeAttribute('open');
                this.removeAttribute('open');
            },
        });

        window.on({
            blur: () => {
                this.#container.removeAttribute('open');
                this.removeAttribute('open');
            },
        });
    }

    get #valueElement(): HTMLElement
    {
        return this.shadow.querySelector('fyn-common-form-button > value')!;
    }

    get #optionElements(): Array<HTMLElement>
    {
        return Array.from(this.#container.shadow.querySelectorAll('options > *'));
    }

    async #updateTemplate(fragment: IFragment<any>)
    {
        const c = this.#valueElement;
        for(const node of c.childNodes)
        {
            c.removeChild(node);
        }

        const scopes = [ this, { properties: { option: this.options[this.index] } } ];
        const { template, bindings } = await hydrate(scopes, fragment.clone());

        this.#bindings = bindings;

        c.appendChild(template);
    }

    async #renderValue()
    {
        const scopes = [ this, { properties: { option: this.options[this.index] } } ];
        await processBindings(this.#bindings, scopes);

        this.#setWidth();
    }

    #setWidth(): void
    {
        const placeholder = this.#valueElement;
        const width = Math.max(
            placeholder?.clientWidth ?? 0,
            ...this.#optionElements.map(o => o.clientWidth),
        );

        this.shadow.setProperty('--min-width', `${width}px`);
    }

    async #update(): Promise<void>
    {
        this._internalOptions = await filterAsync(
            this.options ?? [],
            async o => this.search.length === 0 || await this.filter(this.search, o)
        );
    }

    #findIndex(value: TValue): number
    {
        return this.options?.findIndex(o => equals(o, value)) ?? -1;
    }
}