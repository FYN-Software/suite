import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Button  from '../form/button.js';

export enum Mode
{
    static,
    grow,
}

export default class Dialog extends Component<Dialog, {}>
{
    static localName = 'fyn-common-overlay-dialog';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public title: string = '';

    @property()
    public img: string = '';

    @property()
    public width: number = 0;

    @property()
    public height: number = 0;

    @property()
    public left: number = 0;

    @property()
    public top: number = 0;

    @property()
    public mode: Mode = Mode.grow;

    @property()
    public resizable: boolean = false;

    static get animations(): AnimationConfig
    {
        return {
            open: [
                [ { opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' } ],
                {
                    duration: 300,
                    easing: 'ease-in-out',
                },
            ],
            close: [
                [],
                {
                    extend: 'open',
                    direction: 'reverse',
                },
            ],
        };
    }

    protected async initialize(): Promise<void>
    {
    }

    protected async ready(): Promise<void>
    {
        if(this.mode === Mode.grow)
        {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
        }

        this.top = document.body.offsetHeight / 2 - this.offsetHeight / 2;
        this.left = document.body.offsetWidth / 2 - this.offsetWidth / 2;

        const listener: EventListenerConfig<Button, Button['events']> = {
            click: ({ action }) => {
                switch(action)
                {
                    case 'close':
                        this.close();
                        break;

                    default:
                        this.emit(action);
                        break;
                }
            },
        };

        this.shadow.on<Button>('slot[name="footer"] > [action]', listener);
        this.on<Button>('[slot="footer"][action]', listener);
    }

    public async open(): Promise<Animation|null>
    {
        this.style.setProperty('--x', `${Math.max(0, window.innerWidth / 2 - this.width / 2)}px`);
        this.style.setProperty('--y', `${Math.max(0, window.innerHeight / 2 - this.height / 2)}px`);
        this.style.setProperty('--w', `${Math.min(this.width, window.innerWidth)}px`);
        this.style.setProperty('--h', `${Math.min(this.height, window.innerHeight)}px`);

        return this.hasAttribute('open') === false
            ? this.animateKey('open', .25).stage(() => this.setAttribute('open', ''))
            : null;
    }

    public async close(): Promise<Animation|null>
    {
        return this.hasAttribute('open') === true
            ? this.animateKey('close', .25).stage(() => this.removeAttribute('open'))
            : null;
    }

    async show(modal: boolean = false): Promise<boolean>
    {
        let added = false;

        if(this.parentNode === null)
        {
            added = true;

            document.body.appendChild(this);
        }

        if(modal)
        {
            document.body.setAttribute('modal', '');
        }

        await this.open();

        const res = await this.await('cancel|success');

        await this.close();

        if(modal)
        {
            document.body.removeAttribute('modal');
        }

        if(added)
        {
            document.body.removeChild(this);
        }

        return res;
    }
}
