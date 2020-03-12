import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Collapsible extends Fyn.Component
{
    static localName = 'fyn-common-layout-collapsible';

    static get properties()
    {
        return {
            icons: Types.String,
            title: Types.String,
        };
    }

    async ready()
    {
        this.shadow.on('[title], fyn-common-graphics-icon', {
            click: _ => {
                this.attributes.toggle('closed');

                this.emit('toggle', { open: this.hasAttribute('closed') === false });
            },
        });
    }

    get open()
    {
        return this.hasAttribute('closed') === false;
    }
}
