var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
export var Position;
(function (Position) {
    Position[Position["none"] = 0] = "none";
    Position[Position["top"] = 1] = "top";
    Position[Position["left"] = 2] = "left";
    Position[Position["right"] = 3] = "right";
    Position[Position["bottom"] = 4] = "bottom";
})(Position || (Position = {}));
export default class Tabs extends Component {
    constructor() {
        super(...arguments);
        this.index = -1;
        this.tabs = [];
        this.delimiter = '';
        this.closable = false;
        this.position = Position.none;
        this._observer = new MutationObserver(mutations => {
            for (const m of mutations.filter(m => m.attributeName === 'tab-title')) {
                const tab = this.tabs.find(t => t.element === m.target);
                tab.title = m.target.getAttribute('tab-title') ?? '';
            }
        });
    }
    async initialize() {
        this.observe({
            index: async (o, n) => {
                this.$.content?.scrollTo({
                    left: this.$.content.getBoundingClientRect().width * n,
                    top: 0,
                    behavior: Tabs.prefersReducedMotion ? 'auto' : 'smooth',
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
                // TODO(Chris Kruining) HAAAAACKS...
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
        // this._timeline ??= new ScrollTimeline({
        //     scrollSource: this.$.content,
        //     orientation: 'inline',
        //     fill: 'both',
        //     timeRange: 1000,
        // });
        this._animation?.cancel();
        this._animation = this.$.indicator.animate({
            transform: tabs.map(({ offsetLeft }) => `translateX(${offsetLeft}px)`),
            inlineSize: tabs.map(({ offsetWidth }) => `${offsetWidth}px`),
        }, {
            duration: 1000,
            fill: 'both',
            // timeline: this._timeline,
        });
    }
    static get prefersReducedMotion() {
        return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}
Tabs.localName = 'fyn-common-layout-tabs';
Tabs.styles = ['fyn.suite.base', 'global.theme'];
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