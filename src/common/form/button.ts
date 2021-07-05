import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export type ButtonEventsMap = { click: { action: string } };

export default class Button extends Component<Button>
{
    static localName = 'fyn-common-form-button';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    @property()
    public icons: Array<string> = [];

    @property()
    public iconType: string = 'fas';

    @property()
    public action: string = '';

    @property()
    public tooltip: string = '';

    @property()
    public multi: boolean = false;

    @property()
    public togglable: boolean = false;

    @property()
    public state: boolean = false;

    async initialize()
    {
        this.setAttribute("tabindex", "0");

        this.observe({
            state: () => this.attributes.setOnAssert(this.state, 'active'),
        });

        this.on({
            options: {
                details: false,
            },
            click: (e, target) => {
                if(e instanceof CustomEvent)
                {
                    return;
                }

                e.stopPropagation();
                e.stopImmediatePropagation();

                const ripple = this.shadow.querySelector('ripple > inner')! as HTMLElement;
                ripple.removeAttribute('click');

                (async () => {
                    const { x, y } = target.getBoundingClientRect();

                    ripple.style.left = `calc(${e.pageX - x}px - var(--size) / 2)`;
                    ripple.style.top = `calc(${e.pageY - y}px - var(--size) / 2)`;

                    ripple.setAttribute('click', '');
                })();

                if(this.multi === true)
                {
                    const rect = this.getBoundingClientRect();

                    this.style.setProperty('--x', `${rect.x + rect.width / 2}px`);
                    this.style.setProperty('--y', `${rect.bottom}px`);

                    this.attributes.toggle('open');

                    const c = Array.from(this.children).find(c => e.composedPath().includes(c));

                    if(c !== undefined)
                    {
                        this.emit('click', { previous: e, action: c.getAttribute('action') || this.action });
                    }
                }
                else
                {
                    if(this.togglable === true)
                    {
                        this.state = !this.state;
                    }

                    this.emit('click', { previous: e, action: this.action || this.getAttribute('action') });
                }
            },
        });

        document.body.on({
            click: () => {
                if(this.multi === true)
                {
                    this.removeAttribute('open');
                }
            },
        });
    }

    async ready()
    {

    }
}