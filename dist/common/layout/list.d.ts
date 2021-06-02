import Component from '@fyn-software/component/component.js';
export default class List extends Component<List> {
    static localName: string;
    static styles: string[];
    sortable: boolean;
    protected initialize(): Promise<void>;
    ready(): Promise<void>;
    get items(): Array<HTMLElement>;
}
//# sourceMappingURL=list.d.ts.map