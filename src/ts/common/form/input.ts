import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
import { setAttributeOnAssert } from '@fyn-software/core/function/dom.js';

export type InputEvents = {
    change: { old: string, new: string };
};

export default class Input<TTYpe = string|number|Date> extends FormAssociated<Input<TTYpe>, InputEvents, TTYpe>
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
        this.observe({
            value: (o: TTYpe, n: TTYpe) => {
                const input = this.shadow.querySelector<HTMLInputElement>('input');

                if(input === null)
                {
                    return;
                }

                input.value = String(this.value);
                setAttributeOnAssert(this, String(this.value ?? '').length > 0, 'has-value');

                this.emit('change', { old: o, new: n });
            },
        });
    }

    protected async ready(): Promise<void>
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
            keyup: (e, t) => {
                this.value = (t.valueAsDate ?? (t.valueAsNumber || undefined) ?? t.value) as unknown as TTYpe;
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
            input: (e, t) => {
                const v = (t.valueAsDate ?? (t.valueAsNumber || undefined) ?? t.value) as unknown as TTYpe;

                if(v !== this.value)
                {
                    this.value = v;
                }
            },
        });
    }

    focus()
    {
        this.shadow.querySelector('input')!.focus();
    }
}
