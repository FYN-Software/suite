import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export default class Item extends Component<Item>
{
    static localName = 'fyn-common-navigation-item';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    @property()
    public route: string = '';

    @property()
    public icon: string = '';

    protected async initialize(): Promise<void>
    {
    }

    protected async ready(): Promise<void>
    {
    }
}