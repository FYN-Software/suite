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
                    v = JSON.tryParse(v.replace(/'/g, '"'));
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
        const renderValue = () => {
            const c = this.shadow.querySelector('fyn-common-form-button > value');
            c.childNodes.clear();

            for(const i of this.#container.shadow.querySelectorAll(`options > [index="${this.index}"]`) ?? [])
            {
                c.appendChild(i.cloneNode(true))
            }

            setWidth();
        };
        const setWidth = () => {
            const placeholder = this.shadow.querySelector('fyn-common-form-button > value');
            const width = Math.max(
                placeholder?.clientWidth ?? 0,
                ...this.optionElements.map(o => o.clientWidth),
            );

            this.style.setProperty('--min-width', `${width}px`);
        };

        this.shadow.on('#templateContainer', {
            slotchange: async (e, slot) => {
                const node = this.shadow.querySelector('options');
                const directive = Template.getDirectivesFor(node)[':for'];

                directive.fragment = await Template.scanSlot(slot, ['option']);
            },
        });

        this.shadow.on('options', {
            rendered: async (_, t) => {
                for(const child of Array.from(t.childNodes))
                {
                    this.#container.shadow.querySelector('options').appendChild(child);
                }

                renderValue();
            },
        });

        const update = async () => {
            this._options = this.options.filterAsync(
                async o => this.search.length === 0 || await this.filter(this.search, o)
            );
        };
        const findIndex = value => this.options.findIndex(o => Fyn.Extends.equals(o, value) || o?.value === value);

        this.observe({
            options: async (o, n) => {
                await update();

                this.index = findIndex(this.value);
            },
            index: (o, n) => {
                this.emit('change', { old: this.options[o], new: this.options[n] });

                renderValue();
            },
            value: (o, n) => {
                this.index = findIndex(n);
            },
            filter: update,
            search: update,
        });
    }

    async ready()
    {
        this.#container.shadow.appendChild(this.shadow.querySelector('style').cloneNode(true));
        this.#container.shadow.on('options > *', {
            click: (_, t) => {
                this.index = t.index;

                this.removeAttribute('open');
            },
        });
        document.body.appendChild(this.#container);

        const positionContainer = async () => {
            await Promise.delay(0);

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
}