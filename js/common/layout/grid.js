import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Grid extends Fyn.Component
{
    static localName = 'fyn-common-layout-grid';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

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
        });
    }
}
