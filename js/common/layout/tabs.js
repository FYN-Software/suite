import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Tabs extends Fyn.Component
{
    static localName = 'fyn-common-layout-tabs';

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

                await Promise.delay(50);
                const tabs = this.shadow.querySelectorAll('#bar > tab');

                if(tabs.length === 0)
                {
                    return;
                }

                tabs.forEach(t => t.part = 'tab');
                Array.from(tabs).find(t => t.index === this.index).part = 'tab tab-active';
            },
        });

        this.shadow.on('content > slot', {
            slotchange: async () => {
                await (this.index = -1);

                const bar  = this.shadow.querySelector('#bar');
                const pages = this.pages;

                bar.children.clear();

                for(const [ i, t ] of Object.entries(pages))
                {
                    const tab = document.createElement('tab');
                    tab.textContent = t.getAttribute('tab-title') || '';
                    tab.setAttribute('index', i);
                    tab.dataset.delimiter = this.delimiter;

                    Object.defineProperty(tab, 'panel', {
                        value: t,
                        writable: false,
                        configurable: false,
                        enumerable: false,
                    });

                    this.tabs.push(tab.textContent);

                    // bar.appendChild(tab);
                }

                await (this.index = Math.max(pages.findIndex(t => t.part.contains('tab-active')), 0));
            },
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
        const slot = this.shadow.querySelector('content > slot');

        if(slot === null)
        {
            return [];
        }

        return slot.assignedNodes({ flatten: true }).filter(n => n.nodeType === 1);
    }
}
