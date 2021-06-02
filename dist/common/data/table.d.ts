import Component from '@fyn-software/component/component.js';
declare enum Select {
    none,
    single,
    multiple
}
export default class Table extends Component<Table> {
    static localName: string;
    static styles: string[];
    headers: Array<string>;
    rows: Array<object>;
    select: Select;
    templates: object;
    selection: Array<number>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    get Select(): typeof Select;
    selectedRows(): AsyncGenerator<object, void, unknown>;
    private _setColumns;
}
export {};
//# sourceMappingURL=table.d.ts.map