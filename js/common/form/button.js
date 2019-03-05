import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Button extends Fyn.Component
{
    static get properties()
    {
        return {
            icons: Types.List.type(Types.String).set(v => {
                if(v === undefined || v === null || typeof v === 'boolean')
                {
                    v = [];
                }

                if(Array.isArray(v) !== true)
                {
                    v = JSON.tryParse(v.replace(/'/g, '"'));
                }

                if(Array.isArray(v) !== true)
                {
                    v = [ v ];
                }

                return v;
            }),
            iconType: Types.String.default('fas'),
            role: new Types.String,
            action: new Types.String,
            tooltip: new Types.String,
            multi: new Types.Boolean,
        };
    }

    initialize()
    {
        this.on({
            click: (e, target) =>
            {
                if(e instanceof CustomEvent)
                {
                    return;
                }

                e.stopPropagation();

                this.removeAttribute('click');

                setTimeout(() =>
                {
                    let { x, y } = target.getBoundingClientRect();

                    this.shadow.querySelector('ripple > inner').style.left = `calc(${e.pageX - x}px - var(--size) / 2)`;
                    this.shadow.querySelector('ripple > inner').style.top = `calc(${e.pageY - y}px - var(--size) / 2)`;

                    this.setAttribute('click', '');
                }, 1);

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
                    this.emit('click', { previous: e, action: this.action });
                }
            },
        });

        document.body.on({
            click: () =>
            {
                if(this.multi === true)
                {
                    this.removeAttribute('open');
                }
            },
        });
    }
}
