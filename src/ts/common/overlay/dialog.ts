import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Button  from '../form/button.js';

type DialogEvents = {
    shown: void;
    closed: void;
};

export default class Dialog extends Component<Dialog, DialogEvents>
{
    static localName = 'fyn-common-overlay-dialog';
    static styles = [ 'fyn.suite.base' ];

    @property()
    public title: string = '';

    @property()
    public img: string = '';

    @property()
    public inlineSize: number = 0;

    @property()
    public blockSize: number = 0;

    @property()
    public insetInlineStart: number = 0;

    @property()
    public insetBlockStart: number = 0;

    @property()
    public resizable: boolean = false;

    protected async initialize(): Promise<void>
    {
    }

    protected async ready(): Promise<void>
    {
        this.insetBlockStart = document.body.offsetHeight / 2 - this.offsetHeight / 2;
        this.insetInlineStart = document.body.offsetWidth / 2 - this.offsetWidth / 2;

        const listener:  EventListenerConfig<Button, EventsType<Button>> = {
            click: ({ action }) => {
                switch(action)
                {
                    case 'close':
                    {
                        this.close();
                        break;
                    }

                    default:
                    {
                        this.emit(action);
                        break;
                    }
                }
            },
        };

        this.shadow.on<Button>('slot[name="footer"] > [action]', listener);
        this.on<Button>('[slot="footer"][action]', listener);
    }

    public async open(): Promise<void>
    {
        this.style.setProperty('--inset-inline-start', `${Math.max(0, window.innerWidth / 2 - this.inlineSize / 2)}px`);
        this.style.setProperty('--inset-block-start', `${Math.max(0, window.innerHeight / 2 - this.blockSize / 2)}px`);
        this.style.setProperty('--inline-size', `${Math.min(this.inlineSize, window.innerWidth)}px`);
        this.style.setProperty('--block-size', `${Math.min(this.blockSize, window.innerHeight)}px`);

        this.setAttribute('open', '');

        for(const node of this.childNodes)
        {
            node.emit('shown');
        }

        this.emit('shown');
    }

    public async close(): Promise<void>
    {
        this.removeAttribute('open');

        for(const node of this.childNodes)
        {
            node.emit('closed');
        }

        this.emit('closed');

        // return Promise.delay(300);
    }

    public async show<T = void>(): Promise<T|false>
    {
        let added = false;

        if(this.parentNode === null)
        {
            added = true;

            document.body.appendChild(this);
        }

        await this.open();

        const res = await Promise.race([
            this.await<T>('success'),
            this.await('cancel').then<false>(() => false),
        ]);

        await this.close();

        if(added)
        {
            document.body.removeChild(this);
        }

        return res;
    }
}
