import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';
import Template from '../../../../component/template.js';

export const Position = Types.Enum.define({
    none: {  },
    top: {  },
    left: {  },
    right: {  },
    bottom: {  },
});
export const Tab = Types.Object.define({
    title: Types.String,
    closable: Types.Boolean,
    active: Types.Boolean,
    element: Types.Any,
});

export default class Tabs extends Fyn.Component
{
    static localName = 'fyn-common-layout-tabs';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            index: Types.Number.min(-1).default(-1),
            tabs: Types.List.type(Tab),
            delimiter: Types.String,
            closable: Types.Boolean,
            position: Position.default(Position.none),
        };
    }

    #observer = new MutationObserver(mutations => {
        for(const m of mutations.filter(m => m.attributeName === 'tab-title'))
        {
            const tab = this.tabs.find(t => t.element === m.target);

            tab.title = m.target.getAttribute('tab-title');
        }
    });
    #animation;
    #timeline;

    async initialize()
    {
        this.observe({
            index: async (o, n) => {
                this.$.content.scrollTo({
                    left: this.$.content.getBoundingClientRect().width * n,
                    top: 0,
                    behavior: Tabs.#prefersReducedMotion() ? 'auto' : 'smooth',
                });

                this.emit('switched', { index: n });
            },
            tabs: async (o, n) => {
                await this.$.bar.await('rendered');

                this.#setIndicatorAnimation();
            },
            delimiter: () => {
                this.#setIndicatorAnimation();
            },
        });

        this.shadow.on('main > slot', {
            slotchange: async () => this.#detect(),
        });
    }

    async ready()
    {
        this.shadow.on('#bar', {
            wheel: (e, t) => t.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 25,
        });

        this.shadow.on('#bar > tab', {
            click: (e, t) => {
                this.index = this.docked && this.index === t.index
                    ? -1
                    : t.index;
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

        globalThis.on({
            blur: (e, t) => {
                if(this.docked === true)
                {
                    this.removeAttribute('open');
                    this.index = -1;
                }
            },
        });
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
            for(const c of tab.assignedElements({ flatten: true }))
            {
                activate(c);
            }

            return;
        }

        activate(tab);
    }

    get pages()
    {
        return (async () => {
            await Promise.delay(0);

            return this.shadow.querySelector('main > slot')?.assignedElements({ flatten: true }) ?? [];
        })();
    }

    get docked()
    {
        return this.position !== Position.none;
    }

    async #detect()
    {
        const pages = await Array.fromAsync(this.#pageIterator());

        await (this.tabs = pages.map((p, i) => ({
            active: i === this.index,
            title: p.getAttribute('tab-title') ?? '',
            closable: p.hasAttribute('tab-closable') ?? false,
            element: p,
        })));

        this.#observer.disconnect();
        for(const tab of this.tabs)
        {
            // tab.element.style.opacity = tab.active === true ? '1' : '0';
            // tab.element.style.pointerEvents = tab.active === true ? 'all' : 'none';

            if (tab.element.hasAttribute('tab-title'))
            {
                this.#observer.observe(tab.element, { attributes: true });
            }
        }

        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), this.docked ? -1 : 0));
    };

    async *#pageIterator()
    {
        await Promise.delay(0);

        for(const element of this.shadow.querySelector('main > slot')?.assignedElements({ flatten: true }) ?? [])
        {
            if(globalThis.getComputedStyle(element).display === 'contents')
            {
                // TODO(Chris Kruining) HAAAAACKS...
                if(element.hasAttribute(':for'))
                {
                    await element.await('rendered');
                }

                yield* element.children;

                continue;
            }

            yield element;
        }
    }

    #setIndicatorAnimation()
    {
        const tabs = Array.from(this.$.bar.querySelectorAll('tab'));

        this.#timeline ??= new ScrollTimeline({
            scrollSource: this.$.content,
            orientation: 'inline',
            fill: 'both',
            timeRange: 1000,
        });

        this.#animation?.cancel();
        this.#animation = this.$.indicator.animate(
            {
                transform: tabs.map(({ offsetLeft }) => `translateX(${offsetLeft}px)`),
                inlineSize: tabs.map(({ offsetWidth }) => `${offsetWidth}px`),
            },
            {
                duration: 1000,
                fill: 'both',
                timeline: this.#timeline,
            }
        );
    }

    static #prefersReducedMotion()
    {
        return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}
