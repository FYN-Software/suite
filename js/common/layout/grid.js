import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Grid extends Fyn.Component
{
    static localName = 'fyn-common-layout-grid';
    static styles = [ 'fyn.suite.base' ];

    static get properties()
    {
        return {
            grid: Types.String,
            cells: Types.List.type(Types.String),
        }
    }

    async initialize()
    {
        this.observe({
            grid: () => this.style.setProperty('--grid', this.grid),
            cells: console.log,
        });
    }
}
