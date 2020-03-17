import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Group extends Fyn.Component
{
    static localName = 'fyn-common-form-group';
    static styles = [ 'fyn.suite.base' ];

    static get properties()
    {
        return {
            label: Types.String,
        };
    }
}
