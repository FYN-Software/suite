import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Checkbox extends Fyn.Component
{
    static get properties()
    {
        return {
            toggle: new Types.Boolean,
            checked: new Types.Boolean,
            label: new Types.String,
        };
    }

    initialize()
    {
        this.observe({
            checked: (o, n) => {
                this.shadow.querySelector('box').attributes.setOnAssert(n, 'checked');

                this.emit('change', { old: o, new: n });
            },
        });
    }

    ready()
    {
        this.on('box, label', {
            click: Fyn.Event.debounce(10, () => this.checked = !this.checked),
        });
    }
}
