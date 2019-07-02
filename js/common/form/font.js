import * as Fyn from '../../../../component/fyn.js';

export default class Font extends Fyn.Component
{
    static get properties()
    {
        return {
            _items: [],
            fonts: [],
            variants: [],
            key: '',
            label: '',
        };
    }

    async ready()
    {
        this.on('#fonts', {
            change: e =>
            {
                if(e.detail.new !== undefined)
                {
                    this.variants = e.detail.new.variants;
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
