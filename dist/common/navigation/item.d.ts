import Component from '@fyn-software/component/component.js';
export default class Item extends Component<Item> {
    static localName: string;
    static styles: string[];
    route: string;
    icon: string;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
//# sourceMappingURL=item.d.ts.map