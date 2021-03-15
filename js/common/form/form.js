import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export default class Form extends Fyn.Component
{
    static localName = 'fyn-common-form-form';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            title: Types.String,
            action: Types.String,
            messages: Types.List.type(Types.String),
        };
    }

    async ready()
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

        this.on('[slot="buttons"][action]', {
            click: ({ action }, e, t) => {
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
        if(this.elements.filter(e => e.constructor.formAssociated === true).some(e => e.validity.valid === false))
        {
            return;
        }

        const f = this.elements
            .filter(c => typeof c?.name === 'string' && c?.value !== undefined)
            .reduce((t, c) => Object.assign(t, { [c.name]: c.value }), {});

        this.emit('success', { success: true, ...f });

        return f;
    }

    clear()
    {
        for(const field of this.elements)
        {
            field.clear();
        }
    }

    get elements()
    {
        return this.shadow.querySelector('fields > slot').assignedElements();
    }
}
