import { property } from '@fyn-software/component/decorators.js';
import Dialog from './dialog.js';
import { indexOf } from '@fyn-software/core/function/dom.js';

export default class Picker extends Dialog
{
    static localName = 'fyn-common-overlay-picker';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public items: Array<any> = [];

    public constructor(...args: Array<any>)
    {
        super(...args);

        this.show = this.show.bind(this);
    }

    protected async initialize(): Promise<void>
    {
        await super.initialize();
    }

    protected async ready(): Promise<void>
    {
        await super.ready();

        this.shadow.on('inner > main > inner > *', {
            click: (e, t) => {
                this.emit('success', this.items[indexOf(t)]);
            },
        });
    }

    public async show<T>(items: T[] = []): Promise<T|false>
    {
        this.items = items;

        return super.show<T>();
    }
}
