import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Clock extends Fyn.Component
{
    static get properties()
    {
        return {
            hour: new Types.Number,
            minute: new Types.Number,
            second: new Types.Number,
        };
    }

    ready()
    {
        const date = new Date();
        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
    }
}
