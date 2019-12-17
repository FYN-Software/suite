import * as Fyn from '../../../component/fyn.js';
import * as Types from '../../../data/types.js';

export default class Editor extends Fyn.Component
{
    static get properties()
    {
        return {
            label: Types.String,
            value: Types.String,
        };
    }

    initialize()
    {
        this.observe({
            value: Fyn.Event.debounce(250, (o, n) => {
                this.shadow.querySelector('value').textContent = n;

                this.attributes.setOnAssert(this.value.length > 0, 'has-value');

                this.emit('change', { old: o, new: n });
            }),
        });
    }

    ready()
    {
    }
}
