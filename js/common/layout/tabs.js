import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

export const Tab = Types.Object.define({
    title: Types.String,
    closable: Types.Boolean,
    element: Types.Any,
});

export default class Tabs extends Fyn.Component
{
    static localName = 'fyn-common-layout-tabs';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    #detect = async () => {
        await (this.index = -1);

        const pages = this.pages;

        this.tabs = pages.map(p => ({
            title: p.getAttribute('tab-title') || '',
            closable: p.hasAttribute('tab-closable') ?? false,
            element: p,
        }));
        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), this.docked ? -1 : 0));
    };

    static get properties()
    {
        return {
            index: Types.Number.min(-1).default(-1),
            tabs: Types.List.type(Tab),
            delimiter: Types.String,
            closable: Types.Boolean,
            docked: Types.Boolean,
        };
    }

    async initialize()
    {
        this.setAttribute('tabindex', 0);

        this.observe({
            index: async (o, n) => {
                const pages = this.pages;
                pages.forEach(t => t.removeAttribute('active'));

                if(this.index >= 0 && this.index < this.pages.length)
                {
                    pages[this.index].setAttribute('active', '');
                }

                this.emit('switched', { index: this.index });
            },
        });

        this.shadow.on('main > slot', {
            slotchange: () => this.#detect(),
        });
    }

    async ready()
    {
        this.shadow.on('#bar', {
            wheel: (e, t) => t.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 25,
        });

        this.shadow.on('#bar > tab', {
            click: (e, t) => {
                this.index = this.docked && this.index === t.index ? -1 : t.index;
            },
            auxclick: (e, t) => {
                const tab = this.tabs[t.index];

                if(e.button === 1 && tab.closable)
                {
                    tab.element.remove();
                }
            },
        });

        this.shadow.on('#bar > tab > fyn-common-form-button', {
            click: (_, t) => {
                const tab = this.tabs[t.parentElement.index];

                if(tab.closable)
                {
                    tab.element.remove();
                }
            },
        });

        // this.on({
        //     blur: (e, t) => {
        //         if(this.docked === true)
        //         {
        //             this.removeAttribute('open');
        //             this.index = -1;
        //         }
        //     },
        // });

        globalThis.on({
            blur: (e, t) => {
                // console.log(e, t);

                if(this.docked === true)
                {
                    this.removeAttribute('open');
                    this.index = -1;
                }
            },
            click: (e, t) => {
                // console.log(e.target, e.composedPath(), e);
            },
        });

        document.on('fyn-common-layout-tabs', {
            click: (e, t) => {
                console.log(e, t, t === this)
            },
        });

        this.#detect();
    }

    add(tab, title = '', closable = false)
    {
        if((tab instanceof HTMLElement) !== true)
        {
            throw new Error('expected tab to be a html-element');
        }

        this.tabs.forEach(t => t.removeAttribute('active'));
        this.appendChild(tab);

        const activate = tab => {
            tab.setAttribute('active', '');

            if(tab.hasAttribute('tab-title') !== true)
            {
                tab.setAttribute('tab-title', title);
            }

            if(tab.hasAttribute('tab-closable') !== true)
            {
                tab.setAttribute('tab-closable', closable);
            }
        };

        if(tab instanceof HTMLSlotElement)
        {
            for(let c of tab.assignedElements({ flatten: true }))
            {
                activate(c);
            }

            return;
        }

        activate(tab);
    }

    get pages()
    {
        const slot = this.shadow.querySelector('main > slot');

        if(slot === null)
        {
            return [];
        }

        return slot.assignedElements({ flatten: true });
    }
}
