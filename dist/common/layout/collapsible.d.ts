import Component from '@fyn-software/component/component.js';
export default class Collapsible extends Component<Collapsible, {}> {
    static localName: string;
    static styles: string[];
    icons: string;
    title: string;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    get open(): boolean;
}
//# sourceMappingURL=collapsible.d.ts.map