import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Json extends Fyn.Component
{
    static localName = 'fyn-common-data-json';

    static get properties()
    {
        return {
            depth: Types.Number,
            data: Types.Object,
            children: Types.Object,
            key: Types.String,
            value: Types.String,
        };
    }

    initialize()
    {
        this.observe({
            data: (o, n) => {
                if(this.depth > 3 || n === undefined)
                {
                    this.value = 'Depth limit reached';
                }
                else if(typeof n === 'object')
                {
                    // console.log(n);
                    this.children = n;
                }
                else
                {
                    this.value = n;
                }
            },
        })
    }
}
