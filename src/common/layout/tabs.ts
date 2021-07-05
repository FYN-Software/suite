import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Media, { Preference } from '@fyn-software/core/media.js';

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
    active: boolean,
    element: Element,
};

export default class Tabs extends Component<Tabs>
{
    static localName = 'fyn-common-layout-tabs';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

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

    private _observer = new MutationObserver(mutations => {
        for(const m of mutations.filter(m => m.attributeName === 'tab-title'))
        {
            const tab = this.tabs.find(t => t.element === m.target)!;

            tab.title = (m.target as Element).getAttribute('tab-title') ?? '';
        }
    });
    private _animation?: Animation;
    private _timeline?: AnimationTimeline;

    async initialize()
    {
        this.observe({
            index: async (o: number, n: number) => {
                this.$.content?.scrollTo({
                    left: this.$.content.getBoundingClientRect().width * n,
                    top: 0,
                    behavior: Media.prefers(Preference.reducedMotion) ? 'auto' : 'smooth',
                });

                this.emit('switched', { index: n });
            },
            tabs: async () => {
                await this.$.bar?.await('rendered');

                this._setIndicatorAnimation();
            },
            delimiter: () => {
                this._setIndicatorAnimation();
            },
        });

        this.shadow.on('main > slot', {
            slotchange: () => this._detect(),
        });
    }

    async ready()
    {
        this.shadow.on('_bar', {
            wheel: (e, t) => t.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 25,
        });

        this.shadow.on('_bar > tab', {
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

        this.shadow.on('_bar > tab > fyn-common-form-button', {
            click: (_, t) => {
                const tab = this.tabs[t.parentElement!.index];

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
            await Promise.delay(0);

            return (this.shadow.querySelector('main > slot') as HTMLSlotElement)?.assignedElements({ flatten: true }) ?? [];
        })();
    }

    public get docked()
    {
        return this.position !== Position.none;
    }

    private async _detect(): Promise<void>
    {
        const pages = await Array.fromAsync(this._pageIterator());

        await (this.tabs = pages.map((p: Element, i: number) => ({
            active: i === this.index,
            title: p.getAttribute('tab-title') ?? '',
            closable: p.hasAttribute('tab-closable') ?? false,
            element: p,
        })));

        this._observer.disconnect();
        for(const tab of this.tabs)
        {
            if (tab.element.hasAttribute('tab-title'))
            {
                this._observer.observe(tab.element, { attributes: true });
            }
        }

        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), this.docked ? -1 : 0));
    };

    private async *_pageIterator(): AsyncGenerator<Element, void, never>
    {
        await Promise.delay(0);

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

    private _setIndicatorAnimation(): void
    {
        const tabs = Array.from(this.$.bar!.querySelectorAll('tab')) as Array<HTMLElement>;

        // this._timeline ??= new ScrollTimeline({
        //     scrollSource: this.$.content,
        //     orientation: 'inline',
        //     fill: 'both',
        //     timeRange: 1000,
        // });

        this._animation?.cancel();
        this._animation = this.$.indicator!.animate(
            {
                transform: tabs.map(({ offsetLeft }) => `translateX(${offsetLeft}px)`),
                inlineSize: tabs.map(({ offsetWidth }) => `${offsetWidth}px`),
            },
            {
                duration: 1000,
                fill: 'both',
                // timeline: this._timeline,
            }
        );
    }

    private static get prefersReducedMotion()
    {
        return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}
