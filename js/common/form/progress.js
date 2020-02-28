import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Progress extends Fyn.Component
{
    static localName = 'fyn-common-form-progress';

    static get properties()
    {
        return {
            steps: Types.List.type(Types.String),
            index: Types.Number.min(-1).default(0),
        };
    }

    async initialize()
    {
        this.observe({
            index: async (o, n) => {
                if(this.index < 0 || this.index >= this.steps.length)
                {
                    return;
                }

                const content = this.pages;
                content.forEach(t => t.removeAttribute('active'));
                content[this.index].setAttribute('active', '');
            },
        });

        this.shadow.on('content > slot', {
            slotchange: async () => {
                await (this.index = -1);

                const pages = this.pages;

                this.steps = pages.map(s => s.getAttribute('step') || '-');
                await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), 0));
            },
        });
    }

    async ready()
    {
        this.shadow.on({
            success: () => {
                this.index = Math.min(this.steps.length - 1, this.index + 1);
            },
            cancel: () => this.index = Math.max(0, this.index - 1),
        });

        this.shadow.on('footer > [action]', {
            click: ({ action }) => {
                console.log(action);

                switch (action)
                {
                    case 'next':
                        this.index = Math.min(this.steps.length - 1, this.index + 1);
                        break;

                    case 'previous':
                        this.index = Math.max(0, this.index - 1);
                        break;

                    case 'submit':
                        this.emit('submit');
                        break;

                    case 'cancel':
                        this.emit('cancel');
                        break;
                }

            },
        });
    }

    get pages()
    {
        const slot = this.shadow.querySelector('content > slot');

        if(slot === null)
        {
            return [];
        }

        return slot.assignedElements({ flatten: true });
    }
}
