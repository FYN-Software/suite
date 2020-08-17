import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Checkbox extends Fyn.FormAssociated(Fyn.Component)
{
    static localName = 'fyn-common-form-checkbox';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            toggle: Types.Boolean,
            checked: Types.Boolean,
            locked: Types.Boolean,
            label: Types.String,
            value: Types.Boolean,
        };
    }

    initialize()
    {
        this.observe({
            checked: (o, n) => {
                this.shadow.querySelector('box').attributes.setOnAssert(n, 'checked');

                this.value = n === true;

                this.emit('change', { old: o, new: n });
            },
        });
    }

    ready()
    {
        this.shadow.on('box, label', {
            click: () => {
                if(this.locked)
                {
                    return;
                }

                this.checked = !this.checked
            },
        });
    }
}
