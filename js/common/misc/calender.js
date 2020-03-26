import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Calender extends Fyn.Component
{
    static localName = 'fyn-common-misc-calender';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            value: Types.Datetime,
            today: Types.Datetime,
            year: Types.Number,
            month: Types.Number,
            day: Types.Number,
            days: Types.List.type(Types.Number),
            firstDayOfMonth: Types.Number,
        };
    }

    async ready()
    {
        const date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();

        this.days = Array.from(Array(new Date(this.year, this.month, 0).getDate()).keys(), i => ++i);
        this.firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();

        this.shadow.on('inner span', {
            click: (_, t) => {
                this.shadow
                    .querySelectorAll('inner span[selected]')
                    .forEach(el => el.removeAttribute('selected'));

                t.setAttribute('selected', '');
            },
        });
    }
}
