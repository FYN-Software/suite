import Component from '@fyn-software/component/component.js';
export default class Donut extends Component<Donut, {}> {
    static localName: string;
    static styles: string[];
    label: string;
    group: string;
    legend: boolean;
    data: Array<number>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
//# sourceMappingURL=donut.d.ts.map