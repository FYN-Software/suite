import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Font extends Fyn.Component
{
    static get properties()
    {
        return {
            _items: Types.List,
            fonts: Types.List,
            variants: Types.List,
            key: Types.String,
            label: Types.String,
        };
    }

    async ready()
    {
        this.shadow.on('#fonts', {
            change: e => {
                if(e.new !== undefined)
                {
                    this.variants = e.new.variants;
                }
            },
        });

        const fonts = await (await fetch('/node_modules/@fyn-software/suite/fonts.json')).json();

        this._items = fonts.items.slice(0, 99);

        for(const i of this._items)
        {
            Fyn.Utilities.Font.preview(i);
        }

        this.fonts = Object.entries(this._items).map(([ k, i ]) => ({ value: k, ...i }));
    }
}
