import Component from '@fyn-software/component/component.js';
import { Position } from './tabs.js';
export declare enum Resize {
    none = 0,
    inline = 1,
    block = 2
}
export declare type Cell = {
    area: string;
    docked: Position;
    static: boolean;
    resize: Resize;
};
export default class Docks extends Component<Docks> {
    static localName: string;
    static styles: string[];
    grid: string;
    cells: Array<Cell>;
    closable: boolean;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    add(cell: number, element: Element, title: string, closable: boolean): Promise<void>;
    get Position(): typeof Position;
    get Resize(): typeof Resize;
}
//# sourceMappingURL=docks.d.ts.map