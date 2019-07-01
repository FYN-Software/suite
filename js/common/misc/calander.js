import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Calander extends Fyn.Component
{
    static get properties()
    {
        return {
            value: new Types.Datetime,
            today: Types.Datetime.default(Date.now()),
            year: new Types.Number,
            month: new Types.Number,
            day: new Types.Number,
            days: Types.List.type(Types.Number),
            firstDayOfMonth: new Types.Number,
        };
    }

    ready()
    {
        const date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();

        this.days = Array.from(Array(new Date(this.year, this.month, 0).getDate()).keys(), i => Types.Number.default(++i));
        this.firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();

        this.on('inner span', {
            click: (e, t) => {
                this.shadow
                    .querySelectorAll('inner span[selected]')
                    .forEach(el => el.removeAttribute('selected'));

                t.setAttribute('selected', '');
            },
        });
    }
}
