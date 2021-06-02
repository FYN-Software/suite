import * as Fyn from '../../../../component/fyn.js';
import Template from '../../../../component/template.js';
import * as Types from '../../../../data/types.js';

export default class Dropdown extends Fyn.FormAssociated
{
    static localName = 'fyn-common-form-dropdown';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    #options;
    #container = new Fyn.Container('<options></options>');

    static get properties()
    {
        return {
            _options: Types.List.type(Types.Any),
            options: Types.List.type(Types.Any).set(v => {
                if(v === undefined || v === null)
                {
                    v = [];
                }

                if(typeof v === 'string')
                {
                    v = JSON.tryParse(v.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'"));
                }

                if(v.hasOwnProperty(Symbol.iterator))
                {
                    v = Array.from(v);
                }

                if(Array.isArray(v) !== true)
                {
                    v = [ v ];
                }

                return v.map(i => {
                    if(typeof i !== 'object')
                    {
                        i = { value: i };
                    }

                    if(i.hasOwnProperty('value') !== true)
                    {
                        throw new Error('no value supplied');
                    }

                    return i;
                });
            }),
            index: Types.Number.default(-1),
            value: Types.Any,
            search: Types.String,
            filter: Types.Any.default((f, o) => Object.values(o).some(v => typeof v === 'string' && v.toLowerCase().includes(f))),
            placeholder: Types.String,
            filterable: Types.Boolean,
        };
    }

    async initialize()
    {
        this.shadow.on('#templateContainer', {
            slotchange: async (e, slot) => {
                this.#optionsForDirective.fragment = await Template.scanSlot(slot, ['option']);
            },
        });

        this.observe({
            options: async (o, n) => {
                await this.#update();

                this.index = this.#findIndex(this.value);
            },
            index: (o, n) => {
                this.emit('change', { old: this.options[o], new: this.options[n] });

                this.#renderValue();
            },
            value: (o, n) => {
                this.index = this.#findIndex(n);
            },
            filter: async () => await this.#update(),
            search: async () => await this.#update(),
        });
    }

    async ready()
    {
        this.#container.shadow.adoptedStyleSheets = [ ...this.#container.shadow.adoptedStyleSheets, this.shadow.style ];
        this.#container.shadow.on('options > *', {
            click: (_, t) => {
                this.index = t.index;

                this.removeAttribute('open');
            },
        });

        const node = this.#container.shadow.querySelector('options');
        this.#optionsForDirective.transferTo(node);
        node.on({
            rendered: async (_, t) => {
                await (this.index = this.#findIndex(this.value));

                this.#renderValue();
            },
        })

        document.body.appendChild(this.#container);

        const positionContainer = async () => {
            const rect = this.getBoundingClientRect();

            this.#container.style.setProperty('--x', `${rect.x}px`);
            this.#container.style.setProperty('--y', `${rect.bottom}px`);
            this.#container.style.setProperty('--w', `${rect.width}px`);
            this.#container.style.setProperty('--h', `${Math.clamp(50, 500, globalThis.innerHeight - rect.bottom)}px`);
        };

        this.shadow.on('fyn-common-form-button', {
            click: (_, t) => {
                positionContainer();

                this.#container.attributes.toggle('open');
                this.attributes.toggle('open');

                if(this.filterable === true)
                {
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
                this.#container.removeAttribute('open');
                this.removeAttribute('open');
            },
        });

        globalThis.on({
            blur: e => {
                this.#container.removeAttribute('open');
                this.removeAttribute('open');
            },
        });
    }

    get optionElements()
    {
        return Array.from(this.#container.shadow.querySelectorAll('options > *'));
    }

    get #optionsForDirective()
    {
        return Template.getDirectivesFor(this.shadow.querySelector('options'))[':for'];
    }

    #renderValue()
    {
        const c = this.shadow.querySelector('fyn-common-form-button > value');
        c.childNodes.clear();

        for(const i of Array.from(this.#container.shadow.querySelectorAll(`options > *`)).filter(i => i.index === this.index))
        {
            c.appendChild(i.cloneNode(true))
        }

        this.#setWidth();
    }

    #setWidth()
    {
        const placeholder = this.shadow.querySelector('fyn-common-form-button > value');
        const width = Math.max(
            placeholder?.clientWidth ?? 0,
            ...this.optionElements.map(o => o.clientWidth),
        );

        this.shadow.setProperty('--min-width', `${width}px`);
    }

    async #update()
    {
        this._options = this.options.filterAsync(
            async o => this.search.length === 0 || await this.filter(this.search, o)
        );
    }

    #findIndex(value)
    {
        return this.options.findIndex(o => Fyn.Extends.equals(o, value) || o?.value === value);
    }
}