import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Dropdown extends Fyn.Component
{
    static get properties()
    {
        return {
            _options: Types.List.type(Types.Object),
            _item: new Types.Object,
            options: Types.List.type(Types.Object).set(v => {
                if(typeof v === 'string')
                {
                    v = JSON.tryParse(v.replace(/'/g, '"'));
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
            name: new Types.String,
            valid: Types.Boolean.default(true),
            value: new Types.Object,
            label: new Types.String,
            filter: new Types.String,
            placeholder: Types.String.default('t_select'),
            filterable: new Types.Boolean,
        };
    }

    initialize()
    {
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
                if(this._item === null)
                {
                    this.__item = this.shadow.querySelector('options').loop;
                }

                this._item.option = this.options[this.index];

                this.emit('change', { old: this.options[o], new: this.options[n] });
            },
            value: (o, n) => {
                this.index = this.options.findIndex(o => Fyn.Extends.equals(o, n) || (o.hasOwnProperty('value') && o.value === n));
            },
            filter: update,
        });
    }

    ready()
    {
        this.shadow.querySelector('options').on({
            templatechange: e => this.__item = e.detail.loop,
        });

        this.on('fyn-common-form-button', {
            click: (e, t) => {
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

        this.on('fyn-common-form-button > fyn-common-form-input', {
            change: (e, t) =>
            {
                this.filter = e.detail.new;
            },
        });

        this.on('options > *', {
            click: Fyn.Event.debounce(1, (e, t) => {
                this.value = t.option;

                this.removeAttribute('open');
            }),
        });

        document.body.on({ click: () => this.removeAttribute('open') });
    }

    set __item(loop)
    {
        const c = this.shadow.querySelector('fyn-common-form-button > value');

        c.childNodes.clear();

        this._item = loop.item;
        this._item.option = this.options[this.index] || {};

        c.appendChild(this._item);
    }
}
