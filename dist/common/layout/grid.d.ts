import Component from '@fyn-software/component/component.js';
export default class Grid extends Component<Grid> {
    static localName: string;
    static styles: string[];
    grid: string;
    cells: Array<string>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
//# sourceMappingURL=grid.d.ts.map