import Component from '../../../../component/component.js';
import * as Types from '../../../../data/types.js';

export default class Item extends Component
{
    static localName = 'fyn-common-navigation-item';

    static get properties()
    {
        return {
            route: Types.String,
            icon: Types.String,
        };
    }
}