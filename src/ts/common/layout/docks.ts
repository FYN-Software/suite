import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Tabs, { Position } from './tabs.js';
import { setAttributeOnAssert } from '@fyn-software/core/function/dom.js';

export enum Resize
{
    none,
    inline,
    block,
}
export type Cell = {
    area: string;
    docked: Position;
    static: boolean;
    resize: Resize;
}

export default class Docks extends Component<Docks>
{
    static localName = 'fyn-common-layout-docks';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public grid: string = '';

    @property()
    public cells: Array<Cell> = [];

    @property()
    public closable: boolean = false;

    protected async initialize(): Promise<void>
    {
    }

    protected async ready(): Promise<void>
    {
        this.shadow.on<Tabs>('fyn-common-layout-tabs.docked', {
            switched: ({ index }, t) => {
                setAttributeOnAssert(t, index > -1, 'open');
            },
        })
    }

    public async add(cell: number, element: Element, title: string, closable: boolean): Promise<void>
    {
        if(cell < 0 || cell >= this.cells.length)
        {
            throw new Error(`The cell given is not within a valid range`);
        }

        element.setAttribute('slot', String(cell));
        element.setAttribute('tab-title', title);
        element.setAttribute('tab-closable', String(closable));

        this.appendChild(element);
        void element.getBoundingClientRect();

        await this.isReady;

        const tabs = this.$[cell] as unknown as Tabs;

        tabs.index = tabs.tabs.length - 1;
    }
}
