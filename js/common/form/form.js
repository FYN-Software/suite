import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Form extends Fyn.Component
{
    static localName = 'fyn-common-form-form';

    static get properties()
    {
        return {
            action: Types.String,
            messages: Types.List.type(Types.String),
        };
    }

    async ready()
    {
        this.shadow.on('fields > *', {
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

        this.on('[slot="buttons"][action]', {
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

    submit()
    {
        // TODO(Chris Kruining)
        // Implement form validation

        const f = this.shadow.querySelector('fields > slot').assignedElements()
            .filter(c => c !== null && typeof c.name === 'string' && c.value !== undefined)
            .reduce((t, c) => Object.assign(t, { [c.name]: c.value }), {});

        // console.log(f, this.shadow.querySelector('fields > slot').assignedElements().filter(c => c !== null && typeof c.name === 'string' && c.value !== undefined));

        this.emit('success', { success: true, ...f });
    }

    clear()
    {
        for(const field of this.shadow.querySelector('fields > slot').assignedElements())
        {
            field.clear();
        }
    }
}
