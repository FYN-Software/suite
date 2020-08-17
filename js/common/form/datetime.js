import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Datetime extends Fyn.FormAssociated(Fyn.Component)
{
    static localName = 'fyn-common-form-button';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

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
                if(e.composedPath().includes(this) === false)
                {
                    this.removeAttribute('open');
                }
            },
        });
    }
}