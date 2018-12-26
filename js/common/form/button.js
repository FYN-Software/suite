'use strict';

import * as Fyn from '/js/fyn.js';

export default class Button extends Fyn.Component
{
    static get properties()
    {
        return {
            icons: [],
            role: '',
            tooltip: '',
            multi: false,
        };
    }

    initialize()
    {
        this.observe({
            multi: {
                set: v => typeof v === 'boolean'
                    ? v
                    : this.multi,
            },
        });

        this.on({
            click: (e, target) => {
                if(e instanceof CustomEvent)
                {
                    return;
                }

                e.stopPropagation();

                this.removeAttribute('click');

                setTimeout(() => {
                    let { x, y } = target.getBoundingClientRect();

                    this.shadow.querySelector('ripple > inner').style.left = `calc(${e.pageX - x}px - var(--size) / 2)`;
                    this.shadow.querySelector('ripple > inner').style.top = `calc(${e.pageY - y}px - var(--size) / 2)`;

                    this.setAttribute('click', '');
                }, 1);

                this.emit('click', e);

                if(this.multi === true)
                {
                    this.attributes.toggle('open');
                }
            },
        });

        document.body.on({
            click: () => {
                if(this.multi === true)
                {
                    this.removeAttribute('open');
                }
            },
        });
    }
}