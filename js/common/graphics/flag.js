'use strict';

import Component from '/js/component.js';

export default class Flag extends Component
{
    static get properties()
    {
        return {
            iso: '',
        };
    }

    initialize()
    {
        this.classList.add('flag-icon');

        const style = document.createElement('style');
        style.innerText = `@import url('/css/vendor/flag-icon/css/flag-icon.min.css');`;

        const flag = document.createElement('i');
        flag.classList.add('flag-icon');

        this.shadow.appendChild(style);
        this.shadow.appendChild(flag);

        this.observe({
            iso: {
                set: v => String(v || '').replace(/ /g, ''),
                changed: (o, n) => {
                    try
                    {
                        flag.classList.remove(`flag-icon-${ o }`);
                        flag.classList.add(`flag-icon-${ n }`);
                    }
                    catch(e){}
                },
            }
        });
    }
}