import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Chart extends Fyn.Component
{
    static get properties()
    {
        return {
            type: Types.String.default('line'),
            interpolation: Types.String.default('spline'),
        };
    }

    ready()
    {
        const c = this.shadow.getElementById('c');
        const ctx = c.getContext('2d');
    }
}
