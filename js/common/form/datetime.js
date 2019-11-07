import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Datetime extends Fyn.Component
{
    static get properties()
    {
        return {
            date: Types.Datetime,
            label: Types.String,
            name: Types.String,
            value: Types.String,
        };
    }

    ready()
    {
        const box = this.shadow.querySelector('box');

        this.shadow.on('fyn-common-form-input', {
            click: () => {
                const rect = this.getBoundingClientRect();

                this.style.setProperty('--x', `${rect.x + rect.width / 2}px`);
                this.style.setProperty('--y', `${rect.bottom}px`);

                this.attributes.toggle('open');
            },
        });

        document.on({
            click: (d, t, e) =>
            {
                if(e.composedPath().includes(box) === false)
                {
                    this.removeAttribute('open');
                }
            },
        });
    }
}