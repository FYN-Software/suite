import * as Fyn from '../../../../component/fyn.js';

export default class Calander extends Fyn.Component
{
    static get properties()
    {
        return {
            year: 2019,
            month: 2,
            day: 6,
            days: [],
            firstDayOfMonth: [],
        };
    }

    initialize()
    {
    }

    ready()
    {
        {
            const date = new Date();
            this.year = date.getFullYear();
            this.month = date.getMonth();
            this.day = date.getDate();
        }

        const date = new Date(this.year, this.month, 1);
        this.firstDayOfMonth = date.getDay();
        this.days = [];

        while(date.getMonth() === this.month)
        {
            const day = new Date(date).getDate();

            this.days.push(day);
            date.setDate(date.getDate() + 1);
        }

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
