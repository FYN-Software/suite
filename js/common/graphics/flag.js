import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Flag extends Fyn.Component
{
    static localName = 'fyn-common-graphics-flag';

    static get properties()
    {
        return {
            iso: Types.String,
        };
    }

    initialize()
    {
        this.classList.add('flag-icon');

        const style = document.createElement('style');
        style.innerText = '@import url(\'/node_modules/@fyn-software/suite/css/vendor/flag-icon/css/flag-icon.min.css\');';

        const flag = document.createElement('i');
        flag.classList.add('flag-icon');

        this.shadow.appendChild(style);
        this.shadow.appendChild(flag);

        this.observe({
            iso: (o, n) => {
                try
                {
                    flag.classList.remove(`flag-icon-${ o }`);
                    flag.classList.add(`flag-icon-${ n }`);
                }
                catch(e){}
            },
        });
    }
}
