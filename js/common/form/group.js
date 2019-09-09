import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Group extends Fyn.Component
{
    static get properties()
    {
        return { label: Types.String };
    }
}
