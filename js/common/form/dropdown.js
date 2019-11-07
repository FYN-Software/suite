import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Dropdown extends Fyn.Component
{
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

                return v.map(i =>
                {
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
            name: Types.String,
            valid: Types.Boolean.default(true),
            value: Types.Any,
            label: Types.String,
            filter: Types.String,
            placeholder: Types.String.default('t_select'),
            filterable: Types.Boolean,
        };
    }

    initialize()
    {
        const renderValue = () => {
            const c = this.shadow.querySelector('fyn-common-form-button > value');
            c.childNodes.clear();

            Array.from(this.shadow.querySelectorAll(`options > [index="${this.index}"]`), i => c.appendChild(i.cloneNode(true)));
        };

        this.shadow.on('options', {
            templatechange: renderValue,
        });

        const update = () => {
            this._options = this.options.filter(
                o => this.filter.length === 0 || Object.values(o).some(v => typeof v === 'string' && v.toLowerCase().includes(this.filter))
            );
        };

        this.observe({
            options: (o, n) => {
                this.index = this.options.findIndex(o => Fyn.Extends.equals(o, this.value));

                update();
            },
            index: (o, n) => {
                renderValue();

                this.emit('change', {old: this.options[o], new: this.options[n]});
            },
            value: (o, n) => this.index = this.options.findIndex(o => Fyn.Extends.equals(o, n) || (o.hasOwnProperty('value') && o.value === n)),
            filter: update,
        });
    }

    ready()
    {
        this.shadow.on('fyn-common-form-button', {
            click: (_, t) => {
                const rect = this.getBoundingClientRect();

                this.style.setProperty('--x', `${rect.x}px`);
                this.style.setProperty('--y', `${rect.bottom}px`);
                this.style.setProperty('--w', `${rect.width}px`);
                this.style.setProperty('--h', `${Math.clamp(50, 500, window.innerHeight - rect.bottom)}px`);

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

        this.shadow.on('options > *', {
            click: (_, t) => {
                this.index = t.index;

                this.removeAttribute('open');
            },
        });

        document.body.on({
            click: () => this.removeAttribute('open'),
        });
    }
}
