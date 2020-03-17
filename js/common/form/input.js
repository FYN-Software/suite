import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Input extends Fyn.Component
{
    static localName = 'fyn-common-form-input';
    static styles = [ 'fyn.suite.base' ];

    static get properties()
    {
        return {
            type: Types.String,
            label: Types.String,
            name: Types.String,
            value: Types.String,
            placeholder: Types.String,
            multiline: Types.Boolean,
            regex: Types.String.default('[^\\n]+'),
        };
    }

    async initialize()
    {
        this.modify({
            value: {
                get: () => this.shadow.querySelector('value').textContent,
                set: v => this.shadow.querySelector('value').textContent = v,
            }
        });

        this.shadow.on('value', {
            options: {
                passive: false,
            },
            keydown: e => {
                if([ 8, 16, 17, 37, 38, 39, 40].includes(e.keyCode))
                {
                    return;
                }

                // FUCK ES SOMETHIMES!! cant just read the character about to be inserted...
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

                if((this.value + char).match(new RegExp(`^(${this.regex})*$`, 'g')) === null)
                {
                    e.preventDefault();
                }
            },
            keyup: _ => {
                // this.value = this.shadow.querySelector('value').textContent;
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
        // this.shadow.querySelector('value').textContent = this.value;
    }

    focus()
    {
        this.shadow.querySelector('value').focus();
    }
}
