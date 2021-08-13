import Component from '@fyn-software/component/component.js';
export default class Sparkline extends Component<Sparkline, {}> {
    static localName: string;
    static styles: string[];
    label: string;
    value: string;
    group: string;
    private _chart;
    private _data;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    private render;
}
//# sourceMappingURL=sparkline.d.ts.map