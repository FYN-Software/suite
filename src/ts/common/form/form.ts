import Component from '@fyn-software/component/component.js';
import FormAssociated from '@fyn-software/component/formAssociated.js';
import { property } from '@fyn-software/component/decorators.js';
import Button from './button.js';

export default class Form extends Component<Form, {}>
{
    static localName = 'fyn-common-form-form';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public title: string = '';

    @property()
    public action: string = '';

    @property()
    public messages: Array<string> = [];

    protected async initialize(): Promise<void>
    {
    }

    protected async ready(): Promise<void>
    {
        this.shadow.on('form > *', {
            options: {
                passive: false,
            },
            keydown: e => {
                if(e.key === 'Enter')
                {
                    e.stopPropagation();
                    e.preventDefault();

                    this.submit();
                }
            },
        });

        this.on<Button, { click: { action: string } }>('[slot="buttons"][action]', {
            click: ({ action }) => {
                switch(action)
                {
                    case 'submit':
                        return this.submit();

                    case 'cancel':
                        return this.emit('cancel', { success: false });
                }
            },
        });
    }

    public submit()
    {
        const elements = this.elements;

        if(elements.some(e => e.validity.valid === false))
        {
            return;
        }

        const f = elements
            .filter(c => typeof c?.name === 'string' && c?.value !== undefined)
            .reduce((t, c) => Object.assign(t, { [c.name]: c.value }), {});

        this.emit('success', { success: true, ...f });

        return f;
    }

    public clear(): void
    {
        for(const field of this.elements)
        {
            // field.clear();
        }
    }

    public get elements(): Array<FormAssociated<any, any>>
    {
        return this.shadow.querySelector<HTMLSlotElement>('fields > slot')!
            .assignedElements({ flatten: true })
            .filter(e => e.constructor.hasOwnProperty('formAssociated')) as Array<FormAssociated<any, any>>;
    }
}
