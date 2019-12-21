import * as Fyn from '../../../component/fyn.js';
import * as Types from '../../../data/types.js';

export default class Editor extends Fyn.Component
{
    static get properties()
    {
        return {
            label: Types.String,
            value: Types.String,
        };
    }
}
