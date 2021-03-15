import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Input extends Fyn.FormAssociated
{
    static localName = 'fyn-common-form-input';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            type: Types.String,
            label: Types.String,
            name: Types.String,
            placeholder: Types.String,
            multiline: Types.Boolean,
            regex: Types.String.default('(?!\\n).'),
        };
    }

    async initialize()
    {
        this.shadow.on('input', {
            options: {
                passive: false,
            },
            keydown: async e => {
                if([ 8, 16, 17, 37, 38, 39, 40 ].includes(e.keyCode))
                {
                    return;
                }

                // FUCK ES SOMETIMES!! cant just read the character about to be inserted...
                let char;
                switch (e.key)
                {
                    case 'Enter':
                        char = '\n';
                        break;

                    default:
                        char = e.key;
                        break;
                }

                if(new RegExp(`^(${this.regex})*$`, 'g').test(this.value + char) === false)
                {
                    e.preventDefault();
                }
            },
            keyup: _ => {
                this.value = this.shadow.querySelector('input').value;
            },
        });

        this.shadow.on('input', {
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
                this.shadow.querySelector('input').value = this.value;
                this.attributes.setOnAssert(this.value.length > 0, 'has-value');

                this.emit('change', { old: o, new: n });
            },
        });
    }

    async ready()
    {
    }

    focus()
    {
        this.shadow.querySelector('input').focus();
    }
}
