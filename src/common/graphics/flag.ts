import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export default class Flag extends Component<Flag>
{
    static localName = 'fyn-common-graphics-flag';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    @property()
    public iso: string = '';

    protected async initialize(): Promise<void>
    {

    }

    protected async ready(): Promise<void>
    {
        this.classList.add('flag-icon');

        this.observe({
            iso: (o: string, n: string) => {
                this.classList.remove(`flag-icon-${ o }`);
                this.classList.add(`flag-icon-${ n }`);
            },
        });
    }
}
