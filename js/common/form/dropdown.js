'use strict';

import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Dropdown extends Fyn.Component
{
    static get properties()
    {
        return {
            _options: [],
            options: [],
            index: -1,
            name: '',
            valid: true,
            value: null,
            label: '',
            filter: '',
            filterable: false,
        };
    }

    initialize()
    {
        const update = () => {
            this._options = this.options.filter(o => {
                return this.filter.length === 0
                    || o.value.includes(this.filter)
                    || (o.hasOwnProperty('text') === true && o.text.includes(this.filter))
            });
        };

        this.observe({
            options: {
                set: v => {
                    if(typeof v === 'string')
                    {
                        v = JSON.tryParse(v.replace(/'/g, '"'));
                    }

                    if(Array.isArray(v) !== true)
                    {
                        v = [ v ];
                    }

                    return v.map(i => {
                        if(typeof i !== 'object')
                        {
                            i = {
                                value: i,
                            };
                        }

                        if(i.hasOwnProperty('value') !== true)
                        {
                            throw new Error('no value supplied');
                        }

                        return i;
                    });
                },
                changed: update,
            },
            index: {
                set: v => Number.parseInt(v) || 0,
                changed: (o, n) => {
                    const l = this.shadow.querySelector('options').__loop__;
                    
                    console.log(l);
                    
                    this.emit('change', { old: this.options[o], new: this.options[n] });
                }
            },
            value: {
                get: () => this.options[this.index].value || null,
                changed: (o, n) => {
                    this.index = this.options.findIndex(o => o.value === n) || -1;
                }
            },
            filter: {
                changed: update,
            },
        });
    }

    ready()
    {
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
            change: (e, t) => {
                this.filter = e.detail.new;
            },
        });

        this.on('options > *', {
            click: (e, t) => {
                this.index = t.index();

                this.removeAttribute('open');
            },
        });

        document.body.on({
            click: () => this.removeAttribute('open'),
        });
    }
}
