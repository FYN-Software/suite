import Component from '../../../../component/component.js';
import * as Fyn from '../../../../component/fyn.js';

export default class Menu extends Component
{
    ready()
    {
        this.on(':scope > *', {
            click: Fyn.Event.debounce(1, (e, t) => {
                this.emit('select', t);
            }),
        })
    }
}