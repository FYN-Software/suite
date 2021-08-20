import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export default class Grid extends Component<Grid>
{
    static localName = 'fyn-common-layout-grid';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public grid: string = '';

    @property()
    public cells: Array<string> = [];

    protected async initialize(): Promise<void>
    {
        this.observe({
            grid: () => this.style.setProperty('--grid', this.grid),
        });
    }

    protected async ready(): Promise<void>
    {
    }
}
