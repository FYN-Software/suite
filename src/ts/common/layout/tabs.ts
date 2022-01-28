import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { prefers, Preference } from '@fyn-software/core/media.js';
import Button from '../form/button.js';
import { delay } from '@fyn-software/core/function/promise.js';
import { indexOf } from '@fyn-software/core/function/dom.js';
import { fromAsync } from '@fyn-software/core/function/array.js';

export enum Position
{
    none,
    top,
    left,
    right,
    bottom,
}

export type Tab = {
    title: string,
    closable: boolean,
    element: Element,
};

type TabsEvents = {
    switched: { index: number };
};

export default class Tabs extends Component<Tabs, TabsEvents>
{
    static localName = 'fyn-common-layout-tabs';
    static styles = [ 'fyn.suite.base' ];

    #observer = new MutationObserver(mutations => {
        for(const m of mutations.filter(m => m.attributeName === 'tab-title'))
        {
            const tab = this.tabs.find(t => t.element === m.target)!;

            tab.title = (m.target as Element).getAttribute('tab-title') ?? '';
        }
    });
    #animation?: Animation;
    #timeline?: AnimationTimeline;

    @property()
    public index: number = -1;

    @property()
    public tabs: Array<Tab> = [];

    @property()
    public delimiter: string = '';

    @property()
    public closable: boolean = false;

    @property()
    public position: Position = Position.none;

    async initialize()
    {
        this.observe({
            index: async (o: number, n: number) => {
                this.$.content?.scrollTo({
                    left: this.$.content.getBoundingClientRect().width * this.index,
                    top: 0,
                    behavior: prefers(Preference.reducedMotion) ? 'auto' : 'smooth',
                });

                this.emit('switched', { index: this.index });
            },
            tabs: async () => {
                await this.$.bar?.await('rendered');

                this.#setIndicatorAnimation();
            },
            delimiter: () => {
                this.#setIndicatorAnimation();
            },
        });

        this.shadow.on('#content > slot', {
            slotchange: () => this.#detect(),
        });

        await this.#detect();
    }

    async ready()
    {
        this.shadow.on('#bar', {
            wheel: (e, t) => t.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 25,
        });

        this.shadow.on('#bar > tab', {
            click: (e, t) => {
                const i = Number.parseInt(t.getAttribute('index')!);

                this.index = this.docked && this.index === i
                    ? -1
                    : i;
            },
            auxclick: (e, t) => {
                const tab = this.tabs[indexOf(t)!];

                if(e.button === 1 && tab.closable)
                {
                    tab.element.remove();
                }
            },
        });

        this.shadow.on<Button>('#bar > tab > fyn-common-form-button', {
            click: (_, t) => {
                const tab = this.tabs[indexOf(t.parentElement!)!];

                if(tab.closable)
                {
                    tab.element.remove();
                }
            },
        });

        (globalThis as unknown as EventTarget).on({
            blur: () => {
                if (this.docked !== true)
                {
                    return;
                }

                this.removeAttribute('open');
                this.index = -1;
            },
        });
    }

    add(tab: Element, title: string = '', closable: boolean = false)
    {
        this.tabs.forEach(t => t.element.removeAttribute('active'));
        this.appendChild(tab);

        const activate = (tab: Element) => {
            tab.setAttribute('active', '');

            if(tab.hasAttribute('tab-title') !== true)
            {
                tab.setAttribute('tab-title', title);
            }

            if(tab.hasAttribute('tab-closable') !== true)
            {
                tab.setAttribute('tab-closable', String(closable));
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

    public get pages()
    {
        return (async () => {
            await delay(0);

            return (this.shadow.querySelector('main > slot') as HTMLSlotElement)?.assignedElements({ flatten: true }) ?? [];
        })();
    }

    public get docked()
    {
        return this.position !== Position.none;
    }

    async #detect(): Promise<void>
    {
        const pages = await fromAsync(this.#pageIterator());

        this.#observer.disconnect();
        for(const page of pages)
        {
            if (page.hasAttribute('tab-title'))
            {
                this.#observer.observe(page, { attributes: true });
            }
        }

        await (this.tabs = pages.map((p: Element, i: number) => ({
            title: p.getAttribute('tab-title') ?? '',
            closable: p.hasAttribute('tab-closable') ?? false,
            element: p,
        })));

        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), this.docked ? -1 : 0));
    }

    async *#pageIterator(): AsyncGenerator<Element, void, never>
    {
        await delay(0);

        const slot = this.shadow.querySelector('main > slot') as HTMLSlotElement;

        for(const element of slot?.assignedElements({ flatten: true }) ?? [])
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

    #setIndicatorAnimation(): void
    {
        const tabs = Array.from(this.$.bar!.querySelectorAll('tab')) as Array<HTMLElement>;

        this.#timeline ??= new ScrollTimeline({
            scrollSource: this.$.content,
            orientation: 'inline',
            fill: 'both',
            timeRange: 1000,
        });

        this.#animation?.cancel();
        this.#animation = this.$.indicator!.animate(
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
}
