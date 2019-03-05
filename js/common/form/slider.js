import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Slider extends Fyn.Component
{
    static get properties()
    {
        return {
            _percentVal: Types.Number
                .min(0)
                .max(1)
                .set(v => Number.isNaN(v) ? (this.value - (this.min || 0)) / ((this.max || 360) - (this.min || 0)) : v),
            step: Types.Number.default(.1),
            value: Types.Number.set(v => Math.clamp(this.min || 0, this.max || 360, Number.isNaN(v) ? 0 : v)),
            min: Types.Number.set(v => Math.min(Number.isNaN(v) ? this.min : v, this.max || Infinity)).default(0),
            max: Types.Number.set(v => Math.max(Number.isNaN(v) ? this.max : v, this.min || -Infinity)).default(360),
            label: new Types.String,
            showPercentage: new Types.Boolean,
            showValue: new Types.Boolean,
            vertical: new Types.Boolean,
        };
    }

    initialize()
    {
        this.observe({
            _percentVal: (o, n) => {
                this.shadow.querySelector('box').style.setProperty('--w', `${(this._percentVal * 100).toFixed(1)}%`);

                this.value = (this.max - this.min) * this._percentVal;
            },
            value: (o, n) => {
                this._percentVal = (this.value - this.min) / (this.max - this.min);

                this.emit('change', { old: o, new: n });
            },
            min: () => this.value = this.value,
            max: () => this.value = this.value,
        });
    }

    ready()
    {
        let dragging = false;
        const box = this.shadow.querySelector('box');

        this.on('box > handle', { mousedown: e => dragging = true });

        document.on({
            mousemove: e =>
            {
                if(dragging === true)
                {
                    const rect = this.getBoundingClientRect();
                    const contained = this.vertical === true
                        ? rect.contains(rect.x + 1, e.y)
                        : rect.contains(e.x, rect.y + 1);

                    if(contained === true)
                    {
                        const rect = box.getBoundingClientRect();
                        const p = this.vertical === true
                            ? (e.y - rect.top) / rect.height
                            : (e.x - rect.left) / rect.width;
                        const s = 10 / (this.step / (this.max - this.min));

                        this._percentVal = Math.round(p * s) / s;
                    }
                }
            },
            mouseup: e => dragging = false,
            mouseleave: e => dragging = false,
        });
    }
}
