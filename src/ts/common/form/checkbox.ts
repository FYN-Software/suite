import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';

export default class Checkbox extends FormAssociated<Checkbox, boolean|undefined>
{
    static localName = 'fyn-common-form-checkbox';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public toggle: boolean = false;

    @property<Checkbox>({ aliasFor: 'value' })
    public checked?: boolean = false;

    @property()
    public locked: boolean = false;

    @property()
    public closable: boolean = false;

    protected async initialize(): Promise<void>
    {
        this.observe({
            value: (o: boolean|undefined, n: boolean|undefined) => {
                this.shadow.querySelector('#box')!.setAttribute('checked', String(n));

                this.emit('change', { old: o, new: n });
            },
        });
    }

    protected async ready(): Promise<void>
    {
        this.shadow.on('box, label', {
            click: (e) => {
                if(this.locked)
                {
                    return;
                }

                this.checked = !this.checked;
            },
            mousedown: e => console.log(e),
        });
    }
}
