import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';



export type InputEvents = {
    change: { old: string, new: string };
};

export default class Input extends FormAssociated<Input, InputEvents>
{
    static localName = 'fyn-common-form-input';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public placeholder: string = '';

    @property()
    public regex: string = '(?!\\n).';

    @property()
    public inputmode: string = '';

    protected async initialize()
    {
        this.shadow.on<HTMLInputElement>('input', {
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
                this.value = this.shadow.querySelector('input')!.value;
            },
        });

        this.shadow.on<HTMLInputElement>('input', {
            options: {
                capture: true,
            },
            focus: (e, t) => {
                // t.focused = true;

                this.setAttribute('focused', '');
            },
            blur: (e, t) => {
                // t.focused = false;

                this.removeAttribute('focused');
            },
        });
    }

    protected async ready(): Promise<void>
    {
        this.observe({
            value: (o: string, n: string) => {
                this.shadow.querySelector('input')!.value = this.value;
                this.attributes.setOnAssert(this.value.length > 0, 'has-value');

                this.emit('change', { old: o, new: n });
            },
        });
    }

    focus()
    {
        this.shadow.querySelector('input')!.focus();
    }
}
