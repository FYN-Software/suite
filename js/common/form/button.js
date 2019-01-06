import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Button extends Fyn.Component
{
    static get properties()
    {
        return {
            icons: [],
            role: '',
            action: '',
            tooltip: '',
            multi: false,
        };
    }

    initialize()
    {
        this.observe({
            multi: {
                set: v => typeof v === 'boolean'
                    ? v
                    : this.multi,
            },
        });

        this.on({
            click: (e, target) => {
                if(e instanceof CustomEvent)
                {
                    return;
                }

                e.stopPropagation();

                this.removeAttribute('click');

                setTimeout(() => {
                    let { x, y } = target.getBoundingClientRect();

                    this.shadow.querySelector('ripple > inner').style.left = `calc(${e.pageX - x}px - var(--size) / 2)`;
                    this.shadow.querySelector('ripple > inner').style.top = `calc(${e.pageY - y}px - var(--size) / 2)`;

                    this.setAttribute('click', '');
                }, 1);

                if(this.multi === true)
                {
                    const c = Array.from(this.children).find(c => e.path.includes(c));

                    this.attributes.toggle('open');

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
            click: () => {
                if(this.multi === true)
                {
                    this.removeAttribute('open');
                }
            },
        });
    }
}
