import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

class Mode extends Types.Enum.define({
    static: 0,
    grow: 1,
}){}

export default class Dialog extends Fyn.Component
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

    async open()
    {
        this.style.setProperty('--x', `${window.innerWidth / 2 - this.width / 2}px`);
        this.style.setProperty('--y', `${window.innerHeight / 2 - this.height / 2}px`);
        this.style.setProperty('--w', `${this.width}px`);
        this.style.setProperty('--h', `${this.height}px`);

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

        if(this.parentElement === null)
        {
            added = true;

            document.body.appendChild(this);
        }

        await this.open();

        const res = await Promise.race([
            this.await('cancel|success'),
        ]);

        await this.close();

        if(added)
        {
            document.body.removeChild(this);
        }

        return res;
    }
}
