import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { prefers, Preference } from '@fyn-software/core/media.js';
import { delay } from '@fyn-software/core/function/promise.js';
import { indexOf } from '@fyn-software/core/function/dom.js';
import { fromAsync } from '@fyn-software/core/function/array.js';
export var Position;
(function (Position) {
    Position[Position["none"] = 0] = "none";
    Position[Position["top"] = 1] = "top";
    Position[Position["left"] = 2] = "left";
    Position[Position["right"] = 3] = "right";
    Position[Position["bottom"] = 4] = "bottom";
})(Position || (Position = {}));
export default class Tabs extends Component {
    static localName = 'fyn-common-layout-tabs';
    static styles = ['fyn.suite.base'];
    #observer = new MutationObserver(mutations => {
        for (const m of mutations.filter(m => m.attributeName === 'tab-title')) {
            const tab = this.tabs.find(t => t.element === m.target);
            tab.title = m.target.getAttribute('tab-title') ?? '';
        }
    });
    #animation;
    #timeline;
    index = -1;
    tabs = [];
    delimiter = '';
    closable = false;
    position = Position.none;
    async initialize() {
        this.observe({
            index: async (o, n) => {
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
    async ready() {
        this.shadow.on('#bar', {
            wheel: (e, t) => t.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 25,
        });
        this.shadow.on('#bar > tab', {
            click: (e, t) => {
                const i = Number.parseInt(t.getAttribute('index'));
                this.index = this.docked && this.index === i
                    ? -1
                    : i;
            },
            auxclick: (e, t) => {
                const tab = this.tabs[indexOf(t)];
                if (e.button === 1 && tab.closable) {
                    tab.element.remove();
                }
            },
        });
        this.shadow.on('#bar > tab > fyn-common-form-button', {
            click: (_, t) => {
                const tab = this.tabs[indexOf(t.parentElement)];
                if (tab.closable) {
                    tab.element.remove();
                }
            },
        });
        globalThis.on({
            blur: () => {
                if (this.docked !== true) {
                    return;
                }
                this.removeAttribute('open');
                this.index = -1;
            },
        });
    }
    add(tab, title = '', closable = false) {
        this.tabs.forEach(t => t.element.removeAttribute('active'));
        this.appendChild(tab);
        const activate = (tab) => {
            tab.setAttribute('active', '');
            if (tab.hasAttribute('tab-title') !== true) {
                tab.setAttribute('tab-title', title);
            }
            if (tab.hasAttribute('tab-closable') !== true) {
                tab.setAttribute('tab-closable', String(closable));
            }
        };
        if (tab instanceof HTMLSlotElement) {
            for (const c of tab.assignedElements({ flatten: true })) {
                activate(c);
            }
            return;
        }
        activate(tab);
    }
    get pages() {
        return (async () => {
            await delay(0);
            return this.shadow.querySelector('main > slot')?.assignedElements({ flatten: true }) ?? [];
        })();
    }
    get docked() {
        return this.position !== Position.none;
    }
    async #detect() {
        const pages = await fromAsync(this.#pageIterator());
        this.#observer.disconnect();
        for (const page of pages) {
            if (page.hasAttribute('tab-title')) {
                this.#observer.observe(page, { attributes: true });
            }
        }
        await (this.tabs = pages.map((p, i) => ({
            title: p.getAttribute('tab-title') ?? '',
            closable: p.hasAttribute('tab-closable') ?? false,
            element: p,
        })));
        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), this.docked ? -1 : 0));
    }
    async *#pageIterator() {
        await delay(0);
        const slot = this.shadow.querySelector('main > slot');
        for (const element of slot?.assignedElements({ flatten: true }) ?? []) {
            if (globalThis.getComputedStyle(element).display === 'contents') {
                if (element.hasAttribute(':for')) {
                    await element.await('rendered');
                }
                yield* element.children;
                continue;
            }
            yield element;
        }
    }
    #setIndicatorAnimation() {
        const tabs = Array.from(this.$.bar.querySelectorAll('tab'));
        this.#timeline ??= new ScrollTimeline({
            scrollSource: this.$.content,
            orientation: 'inline',
            fill: 'both',
            timeRange: 1000,
        });
        this.#animation?.cancel();
        this.#animation = this.$.indicator.animate({
            transform: tabs.map(({ offsetLeft }) => `translateX(${offsetLeft}px)`),
            inlineSize: tabs.map(({ offsetWidth }) => `${offsetWidth}px`),
        }, {
            duration: 1000,
            fill: 'both',
            timeline: this.#timeline,
        });
    }
}
__decorate([
    property()
], Tabs.prototype, "index", void 0);
__decorate([
    property()
], Tabs.prototype, "tabs", void 0);
__decorate([
    property()
], Tabs.prototype, "delimiter", void 0);
__decorate([
    property()
], Tabs.prototype, "closable", void 0);
__decorate([
    property()
], Tabs.prototype, "position", void 0);
//# sourceMappingURL=tabs.js.map