import * as Fyn from '../../../../component/fyn.js';

export default class Form extends Fyn.Component
{
    static get properties()
    {
        return {
            action: null,
            messages: [],
        };
    }

    ready()
    {
        this.on('fields > *', {
            options: {
                passive: false,
            },
            keydown: (e, target) => {
                // if(e.keyCode === 9)
                // {
                //     e.preventDefault();
                //
                //     let newElement = Application.page.component(target[e.shiftKey ? 'previousSibling' : 'nextSibling']);
                //
                //     if(newElement !== null && newElement.hasOwnProperty('focus'))
                //     {
                //         newElement.focus();
                //     }
                // }

                if(e.keyCode === 13)
                {
                    e.stopPropagation();
                    e.preventDefault();

                    this.submit();
                }
            },
        });

        this.on('[slot="buttons"][action]', {
            click: (e, target) => {
                switch(target.getAttribute('action'))
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

        console.log(f, this.shadow.querySelector('fields > slot').assignedElements().filter(c => c !== null && typeof c.name === 'string' && c.value !== undefined));

        this.emit('success', { success: true, ...f });
    }
}
