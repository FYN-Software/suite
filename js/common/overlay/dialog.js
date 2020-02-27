import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

class Mode extends Types.Enum.define({
    static: 0,
    grow: 1,
}){}

export default class Dialog extends Fyn.Component
{
    static localName = 'fyn-common-overlay-dialog';

    static get properties()
    {
        return {
            title: Types.String,
            img: Types.String,
            width:  Types.Number.default(800).min(300),
            height:  Types.Number.default(500).min(200),
            top: Types.Number,
            left: Types.Number,
            mode: Mode.default(Mode.grow),
            resizable: Types.Boolean,
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

    async ready()
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

        this.shadow.on('handlers > handler', {
            mousedown: (e, target) => {
                if(moving === false)
                {
                    moving = true;
                    moveHandle = target;
                }
            },
        });

        document.on({
            mousemove: e =>
            {
                if(moving)
                {
                    const directions = (moveHandle.getAttribute('side') || moveHandle.getAttribute('corner')).split('-');
                    const delta = {
                        x: 0,
                        y: 0,
                        reposition: moveHandle.index < 5,
                    };

                    for(const direction of directions)
                    {
                        switch(direction)
                        {
                            case 'top':
                                delta.y = this.top - e.clientY;

                                break;
                            case 'right':
                                delta.x = -1 * (this.left + this.width - e.clientX);

                                break;
                            case 'bottom':
                                delta.y = -1 * (this.top + this.height - e.clientY);

                                break;
                            case 'left':
                                delta.x = this.left - e.clientX;

                                break;
                        }
                    }

                    if(delta.reposition)
                    {
                        this.left += (moveHandle.index === 4 ? 1 : -1) * delta.x;
                        this.top += (moveHandle.index === 0 ? 1 : -1) * delta.y;
                    }

                    this.width += delta.x;
                    this.height += delta.y;

                    this.correctSize();
                }
            },
            mouseup: (e, target) =>
            {
                if(moving)
                {
                    moving = false;
                    moveHandle = null;
                }
            },
        });

        this.correctSize();

        this.on('[slot="footer"][action]', {
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
        });
    }

    correctSize()
    {
        if(this.resizable)
        {
            if(this.width < this.min_width)
            {
                this.width = this.min_width;
            }

            const style = window.getComputedStyle(this, null);
            const min_height = this.mode === Mode.grow
                ? Math.max(
                    this.shadow.querySelector(':scope > header').offsetHeight
                    + this.shadow.querySelector(':scope > main').offsetHeight
                    + Number.parseInt(style.getPropertyValue('padding-top'))
                    + Number.parseInt(style.getPropertyValue('padding-bottom')),
                    this.min_height
                )
                : this.min_height;

            if(this.height < min_height)
            {
                this.height = min_height;
            }

            this.style.setProperty('--x', `${this.left}px`);
            this.style.setProperty('--y', `${this.top}px`);
            this.style.setProperty('--w', `${this.width}px`);
            this.style.setProperty('--h', `${this.height}px`);
        }
    }

    async open()
    {
        this.style.setProperty('--x', `${window.innerWidth / 2 - this.width / 2}px`);
        this.style.setProperty('--y', `${window.innerHeight / 2 - this.height / 2}px`);
        this.style.setProperty('--w', `${this.width}px`);
        this.style.setProperty('--h', `${this.height}px`);

        await this.requestFullscreen({
            navigationUI: 'show',
        });

        this.hasAttribute('open') === false
            ? this.animate('open', .25).stage(() => this.setAttribute('open', ''))
            : null;
    }

    async close()
    {
        return this.hasAttribute('open') === true
            ? this.animate('close', .25).stage(() => this.removeAttribute('open'))
            : null;
    }

    async show()
    {
        let added = false;

        if(this.parentNode === null)
        {
            added = true;

            document.body.appendChild(this);
        }

        await this.open();

        const res = await this.await('cancel|success');

        await this.close();

        if(added)
        {
            document.body.removeChild(this);
        }

        return res;
    }

    async showAsWindow()
    {
        // const dialog = window.open('https://toolkit.fyn.nl/dialog.html', 'this is my window title', 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=0,dependent=on,dialog=on,modal=on,alwaysOnTop=on');
        const dialog = window.open('', 'this is my window title', 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=0,dependent=on,dialog=on,modal=on,alwaysOnTop=on');
        dialog.onerror = e => {
            console.error(e);
        };
        dialog.document.write(`
            <link rel="stylesheet" type="text/css" href="/node_modules/@fyn-software/suite/css/preload.css">
            <link rel="stylesheet" type="text/css" href="/node_modules/@fyn-software/suite/css/style.css">
            <link rel="stylesheet" type="text/css" href="/css/style.css">
            
            <style>
                fyn-common-overlay-dialog {
                    width: 100%;
                    height: 100%;
                    opacity: 1;
                    pointer-events: auto;
                }
            </style>
        `);
        dialog.document.write(this.outerHTML);

        const script = document.createElement('script');
        script.type = 'module';
        script.innerText = `
            import Composer from 'https://toolkit.fyn.nl/node_modules/@fyn-software/component/composer.js';
            import Dialog from '${import.meta.url}';

            Composer.register({
                fyn: (n, t) => \`https://toolkit.fyn.nl/node_modules/@fyn-software/suite/\${t}/\${n.join('/')}.\${t}\`,
                toolkit: (n, t, ns) => \`https://toolkit.fyn.nl/\${t}/\${[ns, ...n].join('/')}.\${t}\`,
            });

            Dialog.init();
        `;

        dialog.document.body.appendChild(script);
    }
}
