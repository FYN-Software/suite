import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export default class Progress extends Component<Progress>
{
    static localName = 'fyn-common-graphics-progress';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    @property()//.min(0).max(1)
    public value: number = 0;

    protected async initialize(): Promise<void>
    {

    }

    protected async ready(): Promise<void>
    {
        this.observe({
            value: (o: number, n: number) => {
                this.shadow.querySelector<HTMLElement>('value')!.style.width = `${n * 100 }%`;
            },
        });
    }
}