import { __decorate } from "tslib";
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Media, { Preference } from '@fyn-software/core/media.js';
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
    index = -1;
    tabs = [];
    delimiter = '';
    closable = false;
    position = Position.none;
    _observer = new MutationObserver(mutations => {
        for (const m of mutations.filter(m => m.attributeName === 'tab-title')) {
            const tab = this.tabs.find(t => t.element === m.target);
            tab.title = m.target.getAttribute('tab-title') ?? '';
        }
    });
    _animation;
    _timeline;
    async initialize() {
        this.observe({
            index: async (o, n) => {
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
    async ready() {
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
                if (e.button === 1 && tab.closable) {
                    tab.element.remove();
                }
            },
        });
        this.shadow.on('_bar > tab > fyn-common-form-button', {
            click: (_, t) => {
                const tab = this.tabs[t.parentElement.index];
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
            await Promise.delay(0);
            return this.shadow.querySelector('main > slot')?.assignedElements({ flatten: true }) ?? [];
        })();
    }
    get docked() {
        return this.position !== Position.none;
    }
    async _detect() {
        const pages = await Array.fromAsync(this._pageIterator());
        await (this.tabs = pages.map((p, i) => ({
            active: i === this.index,
            title: p.getAttribute('tab-title') ?? '',
            closable: p.hasAttribute('tab-closable') ?? false,
            element: p,
        })));
        this._observer.disconnect();
        for (const tab of this.tabs) {
            if (tab.element.hasAttribute('tab-title')) {
                this._observer.observe(tab.element, { attributes: true });
            }
        }
        await (this.index = Math.max(pages.findIndex(t => t.hasAttribute('active')), this.docked ? -1 : 0));
    }
    ;
    async *_pageIterator() {
        await Promise.delay(0);
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
    _setIndicatorAnimation() {
        const tabs = Array.from(this.$.bar.querySelectorAll('tab'));
        this._animation?.cancel();
        this._animation = this.$.indicator.animate({
            transform: tabs.map(({ offsetLeft }) => `translateX(${offsetLeft}px)`),
            inlineSize: tabs.map(({ offsetWidth }) => `${offsetWidth}px`),
        }, {
            duration: 1000,
            fill: 'both',
        });
    }
    static get prefersReducedMotion() {
        return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
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