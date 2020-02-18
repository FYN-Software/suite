import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Collapsible extends Fyn.Component
{
    static localName = 'fyn-common-layout-collapsible';

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
            title: Types.String,
        };
    }

    ready()
    {
        this.shadow.on('[title], fyn-common-graphics-icon', {
            click: _ => this.attributes.toggle('closed'),
        });
    }

    get open()
    {
        return this.hasAttribute('closed') === false;
    }
}
