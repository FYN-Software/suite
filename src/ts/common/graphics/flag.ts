import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

type SizeKey = 'normal'|'square'
type SizeInfo = { x: number, y: number };

export const Size: Record<SizeKey, SizeInfo> = {
    normal: { x: 4, y: 3 },
    square: { x: 1, y: 1 },
};

export default class Flag extends Component<Flag, {}>
{
    static localName = 'fyn-common-graphics-flag';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public iso: string = '';

    @property()
    public size: SizeInfo = Size.normal;

    protected async initialize(): Promise<void>
    {
        // this.classList.add('flag-icon');
        // this.observe({
        //     iso: (o: string, n: string) => {
        //         this.classList.remove(`flag-icon-${ o }`);
        //         this.classList.add(`flag-icon-${ n }`);
        //     },
        // });
    }

    protected async ready(): Promise<void>
    {
    }
}
