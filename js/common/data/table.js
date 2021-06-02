import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';
import Template from '@fyn-software/component/template.js';

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
            templates: Types.Object,
            selection: Types.List.type(Types.Number).default([ 1 ]),
        };
    }

    async initialize()
    {
        this.observe({
            select: (o, n) => {
                this.#setColumns();

                this.selection = {
                    [Select.none]: [],
                    [Select.single]: this.selection.slice(0, 1),
                    [Select.multiple]: this.selection,
                }[n];
            },
            headers: (o, n) => {
                this.#setColumns();
            },
            rows: (o, n) => {
                this.headers = n.reduce((t, r) => [ ...t, ...Object.keys(r) ], []).unique();
            },
            selection: (o, n) => {
                this.$.selectAll.checked =  {
                    [Array.from(this.rows.keys()).length]: true,
                    [0]: false,
                }[n.length] ?? null;
            },
        });

        this.shadow.on('#rowTemplate', {
            slotchange: async (e, t) => {
                this.templates = Object.fromEntries(await Array.fromAsync(
                    t.assignedElements({ flatten: true }),
                    async t => [ t.getAttribute('for'), await Template.scan(t.content, [ 'cell' ]) ],
                ));
            },
        });
    }

    async ready()
    {
        this.shadow.on('#selectAll', {
            click: (e, t) => {
                if(this.select !== Select.multiple)
                {
                    return;
                }

                this.selection = t.checked === true
                    ? Array.from(this.rows.keys())
                    : [];
            },
        });
        this.shadow.on('[id|="row"]', {
            click: (e, t) => {
                const index = t.parentElement.parentElement.index;

                switch (this.select)
                {
                    case Select.multiple:
                    {
                        this.selection = t.checked === true
                            ? [...this.selection, index]
                            : this.selection.filter(i => i !== index);

                        return;
                    }

                    case Select.single:
                    {
                        this.selection = t.checked === true
                            ? [index]
                            : [];

                        return;
                    }

                    case Select.none:
                    default:
                    {
                        return;
                    }
                }
            },
        });
    }

    get Select()
    {
        return Select;
    }

    async *selectedRows()
    {
        for(const index of this.selection)
        {
            yield this.rows[index];
        }
    }

    #setColumns()
    {
        this.shadow.setProperty('--columns', `${this.select === Select.none ? '' : 'auto'} repeat(${this.headers.length}, 1fr)`);
    }
}
