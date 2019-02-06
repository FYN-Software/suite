import * as Fyn from '../../../../component/fyn.js';

export default class dialog extends Fyn.Component
{
    static get properties()
    {
        return {
            title: '',
            img: '',
            width: 800,
            height: 500,
            min_width: 300,
            min_height: 200,
            top: 0,
            left: 0,
            mode: 'grow',
            resizable: false,
        };
    }

    static get animations()
    {
        return {
            open: [
                [ { opacity: 0, transform: 'translate(var(--translation)) scale(.4)' }, { opacity: 1, transform: 'translate(var(--translation)) scale(1)' } ],
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
        if(!Number.isInteger(this.width))
        {
            this.style.width = this.width;

            return;
        }
        else
        {
            this.width = Math.max(this.width, this.offsetWidth);
        }

        let moving = false;
        let moveHandle = null;

        if(this.mode === 'grow')
        {
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
        })

        document.on({
            mousemove: e =>
            {
                if(moving)
                {
                    let delta = {
                        x: 0,
                        y: 0,
                        reposition: moveHandle.index() < 5,
                    };

                    let directions = (moveHandle.getAttribute('side') || moveHandle.getAttribute('corner')).split('-');

                    for(let direction of directions)
                    {
                        switch(direction)
                        {
                            case 'top':
                                delta.y = this.$.top - e.clientY;

                                break;
                            case 'right':
                                delta.x = -1 * (this.$.left + this.$.width - e.clientX);

                                break;
                            case 'bottom':
                                delta.y = -1 * (this.$.top + this.$.height - e.clientY);

                                break;
                            case 'left':
                                delta.x = this.$.left - e.clientX;

                                break;
                        }
                    }

                    console.log(delta.reposition);

                    if(delta.reposition)
                    {
                        this.$.left += (moveHandle.index() === 4 ? 1 : -1) * delta.x;
                        this.$.top += (moveHandle.index() === 0 ? 1 : -1) * delta.y;
                    }

                    this.$.width += delta.x;
                    this.$.height += delta.y;

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
    }

    open()
    {
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

    correctSize()
    {
        if(this.resizable)
        {
            if(this.width < this.min_width)
            {
                this.width = this.min_width;
            }

            const style = window.getComputedStyle(this, null);
            const min_height = this.mode === 'grow'
                ? Math.max(
                    this.querySelector(':scope > header').offsetHeight
                        + this.querySelector(':scope > article').offsetHeight
                        + Number.parseInt(style.getPropertyValue('padding-top'))
                        + Number.parseInt(style.getPropertyValue('padding-bottom')),
                    this.min_height
                )
                : this.min_height;

            if(this.height < min_height)
            {
                this.height = min_height;
            }

            this.setStyle();
        }
    }

    setStyle()
    {
        this.style.transform = 'none';

        this.style.top      = `${this.top}px`;
        this.style.left     = `${this.left}px`;
        this.style.width    = `${this.width}px`;
        this.style.height   = `${this.height}px`;
    }
}
