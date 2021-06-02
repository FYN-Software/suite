import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Slider extends Fyn.FormAssociated
{
    static localName = 'fyn-common-form-slider';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            step: Types.Number.default(.1),
            value: Types.Number,
            min: Types.Number.set(v => Math.min(Number.isNaN(v) ? this.min : v, this.max || Infinity)).default(0),
            max: Types.Number.set(v => Math.max(Number.isNaN(v) ? this.max : v, this.min || -Infinity)).default(360),
            label: Types.String,
            showPercentage: Types.Boolean,
            showValue: Types.Boolean,
            vertical: Types.Boolean,
            snaps: Types.List.type(Types.Number),
        };
    }

    initialize()
    {
        this.observe({
            value: (o, n) => {
                if(Number.isNaN(n))
                {
                    console.trace(o, n);
                }

                this.$.input.value = n;

                this.emit('change', { old: o, new: n });
            },
            snaps: (o, n) => {
                this.shadow.setProperty('--list-length', this.snaps.length);
            },
        });
    }

    ready()
    {
        this.shadow.on('#input', {
            change: (e, t) => this.value = t.value,
        });

        this.shadow.on('#input', {
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

    valueToPercentage(value)
    {
        return (value - this.min) / (this.max - this.min);
    }
}
