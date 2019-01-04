'use strict';

import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Font extends Fyn.Component
{
    static get properties()
    {
        return {
            _items: [],
            fonts: [],
            key: '',
            label: '',
        };
    }

    ready()
    {
        // Fyn.Utilities.Font
        //     .list(this.key)
        
        fetch('http://fyn-software.cpb/suite/fonts.json')
            .then(r => r.json())
            .then(f => {
                this._items = f.items;
                
                for(const i of this._items)
                {
                    // console.log(i);
                    Fyn.Utilities.Font.preview(i);
                }
                
                this.fonts = Object.entries(f.items).map(([k, i]) => ({ value: k, ...i }));
            });
    }
}
