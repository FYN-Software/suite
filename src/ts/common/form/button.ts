import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

type ButtonEvents = { click: { action: string } };

export default class Button extends Component<Button, ButtonEvents>
{
    static localName = 'fyn-common-form-button';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public icons: Array<string> = [];

    @property()
    public iconType: string = 'fas';

    @property()
    public action: string = '';

    @property()
    public tooltip: string = '';

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

                if(this.togglable === true)
                {
                    this.state = !this.state;
                }

                this.emit('click', { previous: e, action: this.action || this.getAttribute('action') });
            },
        });
    }

    async ready()
    {

    }
}