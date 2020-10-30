import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Dropdown extends Fyn.FormAssociated
{
    static localName = 'fyn-common-form-dropdown';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    #options;
    #container = new Fyn.Container();

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
            filter: Types.String,
            placeholder: Types.String,
            filterable: Types.Boolean,
        };
    }

    async initialize()
    {
        const renderValue = () => {
            if(this.#options === undefined)
            {
                return;
            }

            const c = this.shadow.querySelector('fyn-common-form-button > value');
            c.childNodes.clear();

            for(const i of this.shadow.querySelectorAll(`options > [index="${this.index}"]`) ?? [])
            {
                c.appendChild(i.cloneNode(true))
            }

            setWidth();
        };

        this.shadow.on('options', {
            // templatechange: async () => {
            //     await Promise.delay(1000);
            //
            //     renderValue();
            // },
            rendered: () => {
                // TODO(Chris Kruining)
                //  This broke during refactoring in
                //  the lib, fix this scheisse
                // this.#options?.remove();
                // this.#options = this.shadow.querySelector('options').cloneNode(true);
                // this.#options.querySelector(':scope > slot')?.remove();
                // this.#options.on(':scope > *', {
                //     click: (_, t) => {
                //         this.index = t.index;
                //
                //         this.removeAttribute('open');
                //     },
                // });
                //
                // this.#container.shadow.appendChild(this.#options);
            },
        });

        const update = async () => {
            this._options = this.options.filter(
                o => this.filter.length === 0 || Object.values(o).some(v => typeof v === 'string' && v.toLowerCase().includes(this.filter))
            );

            await Promise.delay(100);

            setWidth();
        };

        const setWidth = () => {
            const placeholder = this.shadow.querySelector('fyn-common-form-button > value');
            const width = Math.max(
                placeholder && placeholder.clientWidth || 0,
                ...this.optionElements.map(o => o.clientWidth)
            );

            this.style.setProperty('--min-width', `${width}px`);
        };
        const findIndex = value => this.options.findIndex(o => Fyn.Extends.equals(o, value) || o?.value === value);

        this.observe({
            options: (o, n) => {
                this.index = findIndex(this.value);

                update();
            },
            index: (o, n) => {
                this.emit('change', {old: this.options[o], new: this.options[n]});

                renderValue();
            },
            value: (o, n) => this.index = findIndex(n),
            filter: update,
        });
    }

    async ready()
    {
        this.#container.shadow.appendChild(this.shadow.querySelector('style').cloneNode(true));
        document.body.appendChild(this.#container);

        this.shadow.on('fyn-common-form-button', {
            click: (_, t) => {
                const rect = this.getBoundingClientRect();

                this.#container.style.setProperty('--x', `${rect.x}px`);
                this.#container.style.setProperty('--y', `${rect.bottom}px`);
                this.#container.style.setProperty('--w', `${rect.width}px`);
                this.#container.style.setProperty('--h', `${Math.clamp(50, 500, globalThis.innerHeight - rect.bottom)}px`);

                this.#container.attributes.toggle('open');
                this.attributes.toggle('open');

                if(this.filterable === true)
                {
                    t.querySelector('fyn-common-form-input').focus();
                }
            },
        });

        this.shadow.on('fyn-common-form-button > fyn-common-form-input', {
            change: ({ new: n }) => {
                this.filter = n;
            },
        });

        document.body.on({
            click: (e, t) => {
                this.#container.removeAttribute('open');
                this.removeAttribute('open');
            },
        });
    }

    get optionElements()
    {
        if(this.#options === undefined)
        {
            return [];
        }

        return Array.from(this.#options.querySelectorAll(`:scope > *`));
    }
}