import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Progress extends Fyn.Component
{
    static localName = 'fyn-common-form-progress';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

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

                const pages = this.pages;
                pages.forEach(t => t.removeAttribute('active'));
                pages[this.index].setAttribute('active', '');

                const content = this.shadow.querySelector('content');
                content.scrollTo({
                    left: Math.floor(content.scrollWidth * (this.index / this.steps.length)),
                    behavior: 'smooth',
                })
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
            options: {
                passive: false,
            },
            wheel: e => {
                if(e.shiftKey)
                {
                    e.preventDefault()
                }
            },
            // touchmove: e => {
            //     console.log(e);
            //
            //     e.preventDefault();
            //     e.stopPropagation ();
            //
            //     return false;
            // },
        });

        this.shadow.on('footer > [action]', {
            click: ({ action }) => {
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
