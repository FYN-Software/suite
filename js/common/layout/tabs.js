import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Tabs extends Fyn.Component
{
    static localName = 'fyn-common-layout-tabs';

    static get properties()
    {
        return {
            index: Types.Number.min(-1).default(-1),
        };
    }

    initialize()
    {
        this.observe({
            index: (o, n) => {
                if(this.index < 0 || this.index >= this.tabs.length)
                {
                    return;
                }

                const content = this.tabs;
                content.forEach(t => t.removeAttribute('active'));
                content[this.index].setAttribute('active', '');

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
                const tabs = this.tabs;

                bar.children.clear();

                for(const [ i, t ] of Object.entries(tabs))
                {
                    const tab = document.createElement('tab');
                    tab.textContent = t.getAttribute('tab-title') || 'no title';
                    tab.setAttribute('index', i);
                    tab.part = 'tab';

                    Object.defineProperty(tab, 'panel', {
                        value: t,
                        writable: false,
                        configurable: false,
                        enumerable: false,
                    });

                    bar.appendChild(tab);
                }

                await (this.index = Math.max(tabs.findIndex(t => t.part.contains('tab-active')), 0));
            },
        });
    }

    ready()
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

    get tabs()
    {
        const slot = this.shadow.querySelector('content > slot');

        if(slot === null)
        {
            return [];
        }

        return slot.assignedNodes({ flatten: true }).filter(n => n.nodeType === 1);
    }
}
