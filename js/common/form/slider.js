import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Slider extends Fyn.FormAssociated
{
    static localName = 'fyn-common-form-slider';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            _percentVal: Types.Number
                .min(0)
                .max(1)
                .set(v => Number.isNaN(v) ? (this.value - this.min) / (this.max - this.min) : v),
            step: Types.Number.default(.1),
            value: Types.Number,
            min: Types.Number.set(v => Math.min(Number.isNaN(v) ? this.min : v, this.max || Infinity)).default(0),
            max: Types.Number.set(v => Math.max(Number.isNaN(v) ? this.max : v, this.min || -Infinity)).default(360),
            label: Types.String,
            showPercentage: Types.Boolean,
            showValue: Types.Boolean,
            vertical: Types.Boolean,
        };
    }

    initialize()
    {
        this.observe({
            _percentVal: (o, n) => {
                this.shadow.querySelector('box').style.setProperty('--w', `${(this._percentVal * 100).toFixed(1)}%`);

                this.value = (this.max - this.min) * this._percentVal + this.min;
            },
            value: (o, n) => {
                this._percentVal = (this.value - this.min) / (this.max - this.min);

                this.emit('change', { old: o, new: n });
            },
        });
    }

    ready()
    {
        let dragging = false;
        const box = this.shadow.querySelector('box');

        const move = async ({ x, y }) => {
            const rect = this.getBoundingClientRect();
            const contained = this.vertical === true
                ? rect.contains(rect.x + 1, y)
                : rect.contains(x, rect.y + 1);

            if(contained === true)
            {
                const rect = box.getBoundingClientRect();
                const p = this.vertical === true
                    ? (y - rect.top) / rect.height
                    : (x - rect.left) / rect.width;
                const s = 10 / (this.step / (this.max - this.min));

                this._percentVal = Math.round(p * s) / s;
            }
        };

        this.shadow.on('box, box > handle', {
            mousedown: e => {
                dragging = true;

                move(e);
            },
        });

        document.on({
            mousemove: (e, t) => {
                if(dragging === true)
                {
                    move(e);
                }
            },
            mouseup: _ => dragging = false,
            mouseleave: _ => dragging = false,
        });
    }
}
