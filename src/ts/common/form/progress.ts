import Component from '@fyn-software/component/component.js';
import { property, range } from '@fyn-software/component/decorators.js';
import Button from './button.js';

export type Action = 'next'|'previous'|'submit'|'cancel';

type ProgressEvents = { submit: never, cancel: never };

export default class Progress extends Component<Progress, ProgressEvents>
{
    static localName = 'fyn-common-form-progress';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public steps: Array<string> = [];

    @property()
    @range(-1)
    public index: number = 0;

    @property()
    public verification: (action: Action, page: Element, index: number) => Promise<true|any> = async () => true;

    protected async initialize(): Promise<void>
    {
        this.observe({
            index: async (o: number, n: number) => {
                if(this.index < 0 || this.index >= this.steps.length)
                {
                    return;
                }

                const pages = this.pages;
                pages.forEach(t => t.removeAttribute('active'));
                pages[this.index].setAttribute('active', '');

                const main = this.shadow.querySelector('main')!;
                main.scrollTo({
                    left: Math.floor(main.scrollWidth * (this.index / this.steps.length)),
                    behavior: 'smooth',
                })
            },
        });

        this.shadow.on('main > slot', {
            slotchange: () => this.#detect(),
        });

        await this.#detect();
    }

    protected async ready(): Promise<void>
    {
        this.shadow.on({
            options: {
                passive: false,
            },
            wheel: (e) => {
                if (e.shiftKey)
                {
                    e.preventDefault()
                }
            },
        });

        this.shadow.on<Button>('footer > [action]', {
            click: async ({ action }) => {
                const a = action === 'next' || action === 'submit'
                    ? 'submit'
                    : 'cancel'

                if(await this.verification(a, this.pages[this.index], this.index) !== true)
                {
                    return;
                }

                switch (action)
                {
                    case 'next':
                    {
                        this.index = Math.min(this.steps.length - 1, this.index + 1);
                        break;
                    }

                    case 'previous':
                    {
                        this.index = Math.max(0, this.index - 1);
                        break;
                    }

                    case 'submit':
                    {
                        this.emit('submit');
                        break;
                    }

                    case 'cancel':
                    {
                        this.emit('cancel');
                        break;
                    }
                }

            },
            wheel: (e, t) => console.log(e, t),
        });
    }

    get pages()
    {
        const slot = this.shadow.querySelector<HTMLSlotElement>('main > slot');

        if(slot === null)
        {
            return [];
        }

        return slot.assignedElements({ flatten: true });
    }

    async #detect()
    {
        await (this.index = -1);

        const pages = this.pages;

        this.steps = pages.map(s => s.getAttribute('step') ?? '-');
        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), 0));
    }
}
