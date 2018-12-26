'use strict';

import * as Fyn from '/js/fyn.js';

export default class Input extends Fyn.Component {
    initialize()
    {
        const keys = [ 'Enter' ];

        this.on({
            options: {
                passive: false,
            },
            keydown: e => {
                if(keys.includes(e.key))
                {
                    e.preventDefault();
                }
            },
            keyup: e => {
                if(this.shadow.querySelector('value').textContent.length > 0)
                {
                    this.setAttribute('has-value', '');
                }
                else
                {
                    this.removeAttribute('has-value');
                }
            },
        });

        this.on('value', {
            options: {
                capture: true,
            },
            focus: e => {
                e.target.focused = true;

                this.setAttribute('focused', '');
            },
            blur: e => {
                e.target.focused = false;

                this.removeAttribute('focused');
            },
        });

        this.observe({
            value: {
                changed: Fyn.Event.debounce(250, (o, n) => {
                    this.emit('change', {
                        new: n,
                        old: o,
                    })
                }),
            },
        });
    }

    static get properties()
    {
        return {
            type: '',
            label: '',
            name: '',
            value: '',
        };
    }
}