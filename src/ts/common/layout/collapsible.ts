import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { toggleAttribute } from '@fyn-software/core/function/dom.js';

export default class Collapsible extends Component<Collapsible, {}>
{
    static localName = 'fyn-common-layout-collapsible';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public icons: string = '';

    @property()
    public title: string = '';

    protected async initialize(): Promise<void>
    {
        return Promise.resolve(undefined);
    }

    protected async ready(): Promise<void>
    {
        this.shadow.on('[title], fyn-common-graphics-icon', {
            click: () => {
                toggleAttribute(this, 'closed');

                this.emit('toggle', { open: this.hasAttribute('closed') === false });
            },
        });
    }

    get open()
    {
        return this.hasAttribute('closed') === false;
    }
}
