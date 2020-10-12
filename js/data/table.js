import * as Fyn from '../../../component/fyn.js';
import * as Types from '../../../data/types.js';

export default class Table extends Fyn.Component
{
    static localName = 'fyn-data-table';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            rows: Types.List.type(Types.Object),
        };
    }

    async initialize()
    {
    }

    async ready()
    {
    }
}
