import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Clock extends Fyn.Component
{
    static localName = 'fyn-common-misc-clock';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            hour: Types.Number,
            minute: Types.Number,
            second: Types.Number,
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
