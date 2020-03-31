import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';
import { default as Resizable, Direction } from './resizable.js';
import Tabs from './tabs.js';

export const Layout = Types.Object.define({
    mode: Direction.default(Direction.vertical),
    children: Types.List,
    sizes: Types.List,
});

export default class Docks extends Fyn.Component
{
    static localName = 'fyn-common-layout-docks';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            grid: Types.String,
            cells: Types.List.type(Types.String),
            closable: Types.Boolean,
        };
    }

    async initialize()
    {
    }

    async ready()
    {
    }

    async add(cell, title, element)
    {
        if(cell < 0 || cell >= this.cells.length)
        {
            throw new Error(`The cell given is not within a valid range`);
        }

        element.setAttribute('slot', cell);
        element.setAttribute('tab-title', title);

        this.appendChild(element);

        await Promise.delay(10);

        const tabs = this.shadow.querySelector(`fyn-common-layout-tabs[slot="${cell}"]`);
        tabs.index = tabs.tabs.length - 1;
    }
}
