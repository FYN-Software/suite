import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Icon extends Fyn.Component
{
    constructor(...args)
    {
        super(...args);
    }

    static get properties()
    {
        return {
            type: Types.String.default('fas'),
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
        };
    }

    initialize()
    {
        // this.observe({
        //     icons: (o, n) => console.log(o, n),
        // });
    }
}
