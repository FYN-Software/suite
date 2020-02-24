import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Input extends Fyn.Component
{
    static localName = 'fyn-common-form-input';

    static get properties()
    {
        return {
            type: Types.String,
            label: Types.String,
            name: Types.String,
            value: Types.String,
            placeholder: Types.String,
            multiline: Types.Boolean,
        };
    }

    async initialize()
    {
        const keys = [ 'Enter' ];

        this.shadow.on('value', {
            options: {
                passive: false,
            },
            keydown: e => {
                if(keys.includes(e.key))
                {
                    e.preventDefault();
                }
            },
            keyup: _ => {
                this.value = this.shadow.querySelector('value').textContent;
            },
        });

        this.shadow.on('value', {
            options: {
                capture: true,
            },
            focus: e => {
                e.target.focused = true;

                this.setAttribute('focused', '');
            },
            blur: e => {
                e.target.focused = false;

                this.removeAttribute('focused');
            },
        });

        this.observe({
            value: (o, n) => {
                this.attributes.setOnAssert(this.value.length > 0, 'has-value');

                this.emit('change', { old: o, new: n });
            },
        });
    }

    async ready()
    {
        this.shadow.querySelector('value').textContent = this.value;
    }

    focus()
    {
        this.shadow.querySelector('value').focus();
    }
}
