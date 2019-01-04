'use strict';

import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Modal extends Fyn.Component
{
    static get animations()
    {
        return {
            open: [
                [
                    { opacity: 0 },
                    { opacity: 1 },
                ],
                {
                    duration: 300,
                    fill: 'forwards',
                    easing: 'ease-in-out',
                },
            ],
            close: [
                [],
                {
                    extend: 'open',
                    direction: 'reverse'
                },
            ],
        };
    }

    open()
    {
        return this.hasAttribute('open')
            ? Promise.resolve()
            : this.animate('open', .25).stage(() => this.setAttribute('open', ''));
    }

    close()
    {
        return this.hasAttribute('open') !== true
            ? Promise.resolve()
            : this.animate('close', .25).stage(() => this.removeAttribute('open'));
    }

    toggle()
    {
        this.attributes.toggle('open');
    }
}
