import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

class Mode extends Types.Enum.define({
    static: 0,
    grow: 1,
}){}

export default class dialog extends Fyn.Component
{
    static get properties()
    {
        return {
            title: new Types.String,
            img: new Types.String,
            width:  Types.Number.default(800).min(300),
            height:  Types.Number.default(500).min(200),
            top: new Types.Number,
            left: new Types.Number,
            mode: Mode.default(Mode.grow),
            resizable: new Types.Boolean,
        };
    }

    static get animations()
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

    ready()
    {
        let moving = false;
        let moveHandle = null;

        if(this.mode === Mode.grow)
        {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
        }

        this.top = document.body.offsetHeight / 2 - this.offsetHeight / 2;
        this.left = document.body.offsetWidth / 2 - this.offsetWidth / 2;

        this.on('handlers > handler', {
            mousedown(e, target)
            {
                if(!moving)
                {
                    moving = true;
                    moveHandle = target;
                }
            },
        });

        this.on('[slot="footer"][action]', {
            click: (e, t) => {
                switch(t.action)
                {
                    case 'close':
                        this.close();
                        break;
                }
            },
        });
    }

    open()
    {
        this.style.setProperty('--x', `${window.innerWidth / 2 - this.width / 2}px`);
        this.style.setProperty('--y', `${window.innerHeight / 2 - this.height / 2}px`);
        this.style.setProperty('--w', `${this.width}px`);
        this.style.setProperty('--h', `${this.height}px`);

        return this.hasAttribute('open')
            ? Promise.resolve()
            : this.animate('open', .25).stage(() => this.setAttribute('open', ''));
    }

    close()
    {
        return this.hasAttribute('open') !== true
            ? Promise.resolve()
            : this.animate('close', .25).stage(() => this.removeAttribute('open'));
    }

    show()
    {
        return this.open()
            .then(() => new Promise(res => {
                this.on({
                    options: {
                        capture: true,
                        once: true,
                    },
                    cancel: () => res([ false, null ]),
                    success: e => res([ true, e.detail ]),
                });
            }))
            .stage(this.close.bind(this));
    }
}
