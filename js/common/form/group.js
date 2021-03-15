import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Group extends Fyn.Component
{
    static localName = 'fyn-common-form-group';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            label: Types.String,
        };
    }
}
