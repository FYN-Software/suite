import Component from '@fyn-software/component/component.js';

export default class Menu extends Component<Menu, {}>
{
    static localName = 'fyn-common-navigation-menu';
    static styles = [ 'fyn.suite.base' ];

    protected async initialize(): Promise<void>
    {

    }

    protected async ready(): Promise<void>
    {
        this.on('fyn-common-navigation-item', {
            click: (e, t) => this.emit('select', t),
        })
    }
}