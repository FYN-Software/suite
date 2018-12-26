'use strict';

import Component from '/js/component.js';

export default class Dropdown extends Component
{
    static get properties()
    {
        return {
            index: -1,
            options: [],
            name: '',
            valid: true,
            value: null,
            label: '',
        };
    }

    initialize()
    {
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
                                icons: [],
                                value: i,
                            };
                        }

                        if(i.hasOwnProperty('icons') !== true)
                        {
                            i.icons = [];
                        }

                        if(i.hasOwnProperty('value') !== true)
                        {
                            throw new Error('no value supplied');
                        }

                        return i;
                    });
                },
            },
        });
    }

    ready()
    {
        this.on('fyn-common-form-button', {
            click: e => {
                this.attributes.toggle('open');
            },
        });

        this.on('options > *', {
            click: (e, t) => {
                console.log(e, t);

                this.removeAttribute('open');
            },
        });
    }
}