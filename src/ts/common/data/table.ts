import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
// import Template from '@fyn-software/component/template.js';

declare enum Select
{
    none,
    single,
    multiple,
}

export default class Table extends Component<Table, {}>
{
    static localName = 'fyn-common-data-table';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public headers: Array<string> = [];

    @property()
    public rows: Array<object> = [];

    @property()
    public select: Select = Select.none;

    @property()
    public templates: object = [];

    @property()
    public selection: Array<number> = [ 1 ];

    protected async initialize(): Promise<void>
    {
        this.observe({
            select: (o: Select, n: Select) => {
                this._setColumns();

                this.selection = {
                    [Select.none]: [],
                    [Select.single]: this.selection.slice(0, 1),
                    [Select.multiple]: this.selection,
                }[n];
            },
            headers: (o: Array<string>, n: Array<string>) => {
                this._setColumns();
            },
            rows: (o: Array<object>, n: Array<object>) => {
                this.headers = n.reduce((t: Array<string>, r: object): Array<string> => [ ...t, ...Object.keys(r) ], []).unique();
            },
            selection: (o: Array<number>, n: Array<number>) => {
                (this.$.selectAll as HTMLInputElement).checked =  {
                    [Array.from(this.rows.keys()).length]: true,
                    [0]: false,
                }[n.length] ?? null;
            },
        });

        // this.shadow.on('_rowTemplate', {
        //     slotchange: async (e, t) => {
        //         this.templates = Object.fromEntries(await Array.fromAsync<HTMLTemplateElement, [ string, IFragment<any> ]>(
        //             (t as HTMLSlotElement).assignedElements({ flatten: true }) as Array<HTMLTemplateElement>,
        //             async t => [ t.getAttribute('for')!, await Template.scan(t.content, [ 'cell' ]) ],
        //         ));
        //     },
        // });
    }

    protected async ready(): Promise<void>
    {
        this.shadow.on<HTMLInputElement>('_selectAll', {
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
        this.shadow.on<HTMLInputElement>('[id|="row"]', {
            click: (e, t) => {
                const index = t.parentElement?.parentElement?.index ?? -1;

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

    private _setColumns()
    {
        this.shadow.setProperty('--columns', `${this.select === Select.none ? '' : 'auto'} repeat(${this.headers.length}, 1fr)`);
    }
}
