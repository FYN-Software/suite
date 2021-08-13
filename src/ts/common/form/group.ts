import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export default class Group extends Component<Group, {}>
{
    static localName = 'fyn-common-form-group';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public label: string = '';

    protected async initialize(): Promise<void>
    {
    }

    protected async ready(): Promise<void>
    {
    }
}
