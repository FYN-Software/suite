import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Checkbox extends Fyn.FormAssociated
{
    static localName = 'fyn-common-form-checkbox';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            toggle: Types.Boolean,
            checked: Types.Boolean.nullable,
            locked: Types.Boolean,
            label: Types.String,
            value: Types.Boolean.nullable,
        };
    }

    initialize()
    {
        this.observe({
            checked: (o, n) => {
                this.shadow.querySelector('box').setAttribute('checked', String(n));

                this.value = n;

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
