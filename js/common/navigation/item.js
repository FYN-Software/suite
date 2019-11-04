import Component from '../../../../component/component.js';
import * as Types from '../../../../data/types.js';

export default class Item extends Component
{
    static get properties()
    {
        return {
            route: Types.String,
        };
    }
}