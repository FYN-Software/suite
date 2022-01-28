import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

type ShellEvents = {};

export default class Shell extends Component<Shell, ShellEvents>
{
    static localName = 'fyn-common-layout-shell';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public title: string = '';

    protected async initialize(): Promise<void>
    {
    }

    async ready()
    {
    }
}