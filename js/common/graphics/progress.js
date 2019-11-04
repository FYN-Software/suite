import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Progress extends Fyn.Component
{
    static get properties()
    {
        return {
            value: Types.Number.min(0).max(1),
        };
    }

    ready()
    {
        this.observe({
            value: (o, n) => {
                this.shadow.querySelector('value').style.width = `${n * 100 }%`;
            },
        });
    }
}