import FormAssociated from '@fyn-software/component/formAssociated.js';
import { range } from '@fyn-software/component/decorators.js';
import Button from './button.js';
import Slider from './slider.js';

interface IColor
{

}

class Hlsa implements IColor
{
    @range(0, 360)
    hue: number = 180;
    @range(0, 1)
    saturation: number = 0;
    @range(0, 1)
    lightness: number = .2;
    @range(0, 1)
    alpha: number = 1;
}

export default class Color extends FormAssociated<Color, {}, Hlsa>
{
    static localName = 'fyn-common-form-color';
    static styles = [ 'fyn.suite.base' ];

    constructor(...args: Array<any>)
    {
        super(...args);

        const value = new Hlsa;
        value.hue = 349;
        value.saturation = .63;
        value.lightness = .5;

        this.value = value;
    }

    protected  async initialize(): Promise<void>
    {
        this.observe({
            value: (o: Hlsa, n: Hlsa) => {
                const { hue, saturation, lightness, alpha } = this.value;

                console.log(this.value, hue, saturation, lightness, alpha);

                this.style.setProperty('--value', `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`);

                this.emit('change', { old: o, new: n });
            },
        });
    }

    protected  async ready(): Promise<void>
    {
        let editedValue = { ...this.value };

        this.shadow.on('value', {
            click: (_, t) => {
                editedValue = { ...this.value };
                const { hue, saturation, lightness, alpha } = editedValue;

                const rect = t.getBoundingClientRect();

                this.style.setProperty('--x', `${rect.x}px`);
                this.style.setProperty('--y', `${rect.y}px`);
                this.style.setProperty('--hue', String(hue));
                this.style.setProperty('--sat', `${ saturation * 100 }%`);
                this.style.setProperty('--light', `${ lightness * 100 }%`);
                this.style.setProperty('--alpha', String(alpha));

                this.shadow.querySelector<Slider>('fyn-common-form-slider[vertical]')!.value = hue;
                this.shadow.querySelector<Slider>('fyn-common-form-slider[horizontal]')!.value = 1 - alpha;

                this.setAttribute('open', '');
            },
        });

        this.shadow.on<Button>('box [action]', {
            click: (e, t) => {
                switch(t.action)
                {
                    case 'submit':
                        this.value = { ...editedValue };

                        break;
                }

                this.removeAttribute('open');
            },
        });

        this.shadow.on<Slider>('fyn-common-form-slider[vertical]', {
            change: (_, t) => {
                editedValue.hue = t.value;

                this.style.setProperty('--hue', String(t.value));
            },
        });

        this.shadow.on<Slider>('fyn-common-form-slider[horizontal]', {
            change: (_, t) => {
                editedValue.alpha = 1 - t.value;

                this.style.setProperty('--alpha', String(1 - t.value));
            },
        });
        let dragging = false;

        const box = this.shadow.querySelector<HTMLElement>('box > gradient')!;
        const position = (x: number, y: number) => {
            const rect = box.getBoundingClientRect();

            console.log(x, y, rect, rect.contains(x, y));

            if(rect.contains(x, y) === true)
            {
                editedValue.saturation = (x - rect.left) / rect.width;
                editedValue.lightness = 1 - (y - rect.top) / rect.height;

                this.style.setProperty('--sat', `${ editedValue.saturation * 100 }%`);
                this.style.setProperty('--light', `${ editedValue.lightness * 100 }%`);
            }
        };

        this.shadow.on('box > gradient', {
            options: {
                details: false,
            },
            mousedown: e => {
                dragging = true;

                position(e.x, e.y);
            }
        });

        document.body.on({
            options: {
                details: false,
            },
            mousemove: e => {
                if(dragging === true)
                {
                    position(e.x, e.y);
                }
            },
            mouseup: () => dragging = false,
            mouseleave: () => dragging = false,
        });
    }
}
