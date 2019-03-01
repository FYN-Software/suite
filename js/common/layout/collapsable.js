import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Collapsable extends Fyn.Component
{
    static get properties()
    {
        return {
            title: new Types.String,
        };
    }

    ready()
    {
        this.on('span[title], fyn-common-graphics-icon', { click: Fyn.Event.debounce(10, e => this.attributes.toggle('closed')) });
    }

    get open()
    {
        return this.hasAttribute('closed') === false;
    }
}
