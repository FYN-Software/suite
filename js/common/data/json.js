import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Json extends Fyn.Component
{
    static get properties()
    {
        return {
            depth: Types.Number.default(0),
            data: Types.Object.default({}),
            children: Types.Object.default({}),
            key: new Types.String,
            value: new Types.String,
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
