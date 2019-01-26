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

    ready()
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

        // Fyn.Utilities.Font
        //     .list(this.key)

        fetch('http://fyn-software.cpb/suite/fonts.json')
            .then(r => r.json())
            .then(f =>
            {
                this._items = f.items.slice(0, 99);

                for(const i of this._items)
                {
                    // Console.log(i);
                    Fyn.Utilities.Font.preview(i);
                }

                this.fonts = Object.entries(this._items).map(([ k, i ]) => ({ value: k, ...i }));
            });
    }
}
