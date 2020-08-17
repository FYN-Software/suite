import Component from '../../../../component/component.js';
import * as Fyn from '../../../../component/fyn.js';

export default class Menu extends Component
{
    static localName = 'fyn-common-navigation-menu';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    async ready()
    {
        this.on('fyn-common-navigation-item', {
            click: (e, t) => {
                console.log(t);

                this.emit('select', t);
            },
        })
    }
}