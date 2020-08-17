import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Button extends Fyn.Component
{
    static localName = 'fyn-common-form-button';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

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
            action: Types.String,
            tooltip: Types.String,
            multi: Types.Boolean,
            togglable: Types.Boolean,
            state: Types.Boolean,
        };
    }

    initialize()
    {
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

                const ripple = this.shadow.querySelector('ripple > inner');
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
}
