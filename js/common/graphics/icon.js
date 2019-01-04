'use strict';

import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Icon extends Fyn.Component
{
    static get properties()
    {
        return {
            icons: [],
        };
    }

    initialize()
    {
        this.observe({
            icons: {
                set: (v) => {
                    if(v === undefined || typeof v === 'boolean')
                    {
                        v = [];
                    }

                    if(Array.isArray(v) !== true)
                    {
                        v = JSON.tryParse(v.replace(/'/g, '"'));
                    }

                    if(Array.isArray(v) !== true)
                    {
                        v = [ v ];
                    }

                    return v;
                },
                changed: (o, n) => {
                    // this.shadow.querySelectorAll('i').clear();
                    //
                    // for(let i of n)
                    // {
                    //     let c = document.createElement('i');
                    //     c.classList.add('fas', `fa-${encodeURI(i)}`);
                    //
                    //     this.shadow.appendChild(c);
                    // }
                },
            }
        });
    }
}
