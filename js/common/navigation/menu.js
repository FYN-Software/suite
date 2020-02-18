import Component from '../../../../component/component.js';
import * as Fyn from '../../../../component/fyn.js';

export default class Menu extends Component
{
    static localName = 'fyn-common-navigation-menu';

    async ready()
    {
        this.on(':scope > :not([slot])', {
            click: (e, t) => {
                this.emit('select', t);
            },
        })
    }
}