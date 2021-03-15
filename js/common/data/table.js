import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export const Select = Types.Enum.define({
    none: {},
    single: {},
    multiple: {},
});

export default class Table extends Fyn.Component
{
    static localName = 'fyn-common-data-table';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            headers: Types.List.type(Types.String),
            rows: Types.List.type(Types.Object),
            select: Select.default(Select.none),
        };
    }

    async initialize()
    {
        this.observe({
            rows: (o, n) => {
                this.headers = n.reduce((t, r) => [ ...t, ...Object.keys(r) ], []).unique();
            },
        });
    }

    async ready()
    {
        console.log(this.select)
    }

    get Select()
    {
        return Select;
    }
}
