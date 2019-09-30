import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Collapsable extends Fyn.Component
{
    static get properties()
    {
        return {
            icons: Types.List.type(Types.String).set(v => {
                if(v === undefined || v === null || typeof v === 'boolean')
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
            }),
            title: new Types.String,
        };
    }

    ready()
    {
        this.on('[title], fyn-common-graphics-icon', { click: Fyn.Event.debounce(10, e => this.attributes.toggle('closed')) });
    }

    get open()
    {
        return this.hasAttribute('closed') === false;
    }
}
