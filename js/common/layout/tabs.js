import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Tabs extends Fyn.Component
{
    static localName = 'fyn-common-layout-tabs';
    static styles = [ 'fyn.suite.base' ];

    #detect = async () => {
        await (this.index = -1);

        const pages = this.pages;

        this.tabs = pages.map(p => p.getAttribute('tab-title') || '');
        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), 0));
    };

    static get properties()
    {
        return {
            index: Types.Number.min(-1).default(-1),
            tabs: Types.List.type(Types.String),
            delimiter: Types.String,
        };
    }

    async initialize()
    {
        this.observe({
            index: async (o, n) => {
                if(this.index < 0 || this.index >= this.pages.length)
                {
                    return;
                }

                const content = this.pages;
                content.forEach(t => t.removeAttribute('active'));
                content[this.index].setAttribute('active', '');
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
            click: (_, t) => this.index = t.index,
        });

        this.#detect();
    }

    add(tab, title = '')
    {
        if((tab instanceof HTMLElement) !== true)
        {
            throw new Error('expected tab to be a html-element');
        }

        this.tabs.forEach(t => t.removeAttribute('active'));
        this.appendChild(tab);

        if(tab instanceof HTMLSlotElement)
        {
            for(let c of tab.assignedElements({ flatten: true }))
            {
                c.setAttribute('active', '');

                if(c.hasAttribute('tab-title') !== true)
                {
                    c.setAttribute('tab-title', title);
                }
            }
        }
        else
        {
            tab.setAttribute('active', '');

            if(tab.hasAttribute('tab-title') !== true)
            {
                tab.setAttribute('tab-title', title);
            }
        }
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
