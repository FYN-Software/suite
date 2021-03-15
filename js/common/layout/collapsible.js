import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Collapsible extends Fyn.Component
{
    static localName = 'fyn-common-layout-collapsible';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

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
