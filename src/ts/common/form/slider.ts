import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';

type SliderEvents = {
    input: { value: number };
};

export default class Slider extends FormAssociated<Slider, SliderEvents, number>
{
    static localName = 'fyn-common-form-slider';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public step: number = .1;

    @property<Slider>({
        set(v): number
        {
            return Math.min(Number.isNaN(v) ? this.min : v, this.max || Infinity);
        }
    })
    public min: number = 0;

    @property<Slider>({
        set(v): number
        {
            return Math.max(Number.isNaN(v) ? this.max : v, this.min || -Infinity);
        }
    })
    public max: number = 360;

    @property()
    public showPercentage: boolean = false;

    @property()
    public showValue: boolean = false;

    @property()
    public vertical: boolean = false;

    @property()
    public snaps: Array<number> = [];

    protected async initialize(): Promise<void>
    {
        this.observe({
            value: (o: number, n: number) => {
                if(Number.isNaN(n))
                {
                    console.trace(o, n);
                }

                const input: HTMLInputElement = this.$.input as HTMLInputElement;

                if(input === null)
                {
                    return;
                }

                input.valueAsNumber = n;

                this.emit('change', { old: o, new: n });
            },
            snaps: () => {
                this.shadow.setProperty('--list-length', this.snaps.length);
            },
        });
    }

    protected async ready(): Promise<void>
    {
        this.shadow.on<HTMLInputElement>('#input', {
            change: (e, t) => this.value = t.valueAsNumber,
        });

        this.shadow.on<HTMLInputElement>('#input', {
            options: {
                passive: false,
            },
            input: (e, t) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                this.emit('input', { value: t.value });
            },
        });
    }

    private valueToPercentage(value: number): number
    {
        return (value - this.min) / (this.max - this.min);
    }
}
