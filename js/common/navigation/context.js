import Component from '../../../../component/component.js';
import * as Types from '../../../../data/types.js';

export default class Context extends Component
{
    static localName = 'fyn-common-navigation-context';

    static get properties()
    {
        return {
            route: Types.String,
        };
    }
}