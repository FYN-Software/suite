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
    static styles = [ 'fyn.suite.base' ];

    static get properties()
    {
        return {
            grid: Types.String,
            cells: Types.List.type(Types.String),
        };
    }

    async initialize()
    {
    }

    async ready()
    {
    }
}
