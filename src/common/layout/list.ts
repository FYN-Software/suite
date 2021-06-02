import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export default class List extends Component<List>
{
    static localName = 'fyn-common-layout-list';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    @property()
    public sortable: boolean = false;

    protected async initialize(): Promise<void>
    {
    }

    async ready()
    {
        this.observe({
            sortable: () => this.items.forEach(i => i.draggable = this.sortable),
        });

        this.shadow.on('slot', {
            slotchange: () => this.items.forEach(i => i.draggable = this.sortable),
        });
    }

    public get items(): Array<HTMLElement>
    {
        const slot = this.shadow.querySelector('slot');

        return slot !== null
            ? slot.assignedElements({ flatten: true }) as Array<HTMLElement>
            : [];
    }
}