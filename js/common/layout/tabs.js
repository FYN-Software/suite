import * as Fyn from '../../../../component/fyn.js';

export default class Tabs extends Fyn.Component
{
    static get properties()
    {
        return {
            index: -1,
        };
    }

    initialize()
    {
        this.observe({
            index: {
                changed: (o, n) =>
                {
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

                    tabs.forEach(t => t.removeAttribute('active'));
                    tabs[this.index].setAttribute('active', '');
                },
            },
        });

        this.on('content > slot', {
            slotchange: (e, t) =>
            {
                this.index = -1;

                const bar  = this.shadow.querySelector('#bar');
                const tabs = this.tabs;

                bar.innerHTML = '';

                for(let t of tabs)
                {
                    const tab = document.createElement('tab');
                    tab.innerHTML = t.getAttribute('tab-title') || 'no title';

                    Object.defineProperty(tab, 'panel', {
                        value: t,
                        writable: false,
                    });

                    bar.appendChild(tab);
                }

                this.index = Math.max(tabs.findIndex(t => t.hasAttribute('active')), 0);
            },
        });
    }

    ready()
    {
        this.on('#bar', {
            wheel: (e, t) =>
            {
                t.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 25;
            },
        });

        this.on('#bar > tab', {
            click: (e, t) =>
            {
                this.index = t.index();
            },
        });

        const content = this.shadow.querySelector('content');
        const overlay = this.shadow.querySelector('overlay');
        const placeholder = this.shadow.querySelector('placeholder');

        this.on({
            dragstart: Fyn.Event.throttle(1, e =>
            {
                window.dragTarget = this.shadow.querySelector('content > slot').assignedElements()[e.path[0].index()];
                window.dragSource = this;

                console.log(e);

                window.dragPreview = document.createElement('drag-preview');
                window.dragPreview.appendChild(
                    window.dragTarget
                        .cloneNode(true)
                        .cloneStyle(window.dragTarget, [ 'color', 'background-color' ])
                );

                document.body.appendChild(window.dragPreview);

                e.dataTransfer.setDragImage(new Image(), 0, 0);
                e.dataTransfer.effectAllowed = 'move';
            }),
        });

        let lastPos = { x: 0, y: 0 };

        // TODO(Chris Kruining)
        // Migrate all drag and
        // Drop behavior that's
        // Is more than sorting
        // The tabs to the
        // `Docks` component
        //
        // Idea for migration ::
        // Have a single overlay
        // & placeholder in the
        // Root `Docks` and utilize
        // The `clientRect` of child
        // `Tabs` to place the
        // Overlay & placeholder
        document.body.on({
            dragover: e =>
            {
                if(window.dragPreview === undefined)
                {
                    return;
                }

                window.dragPreview.style.setProperty('--x', `${e.pageX}px`);
                window.dragPreview.style.setProperty('--y', `${e.pageY}px`);

                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                lastPos = { x: e.x, y: e.y };
            },
            dragend: e =>
            {
                overlay.setAttribute('hidden', '');
                Array.from(overlay.children).forEach(c => c.removeAttribute('hovering'));

                placeholder.setAttribute('hidden', '');
                placeholder.style.setProperty('--x', '0');
                placeholder.style.setProperty('--y', '0');
                placeholder.style.setProperty('--w', '0');
                placeholder.style.setProperty('--h', '0');

                if(window.dragPreview === undefined)
                {
                    return;
                }

                window.dragPreview.remove();
                window.dragPreview = undefined;
            },
            dragleave: (e, t) =>
            {
                if(window.dragPreview === undefined)
                {
                    return;
                }

                window.dragPreview.style.setProperty('--x', '0px');
                window.dragPreview.style.setProperty('--y', '0px');

                e.dataTransfer.setDragImage(preview, 0, 0);

                // Const s = document.createElement('style');
                // S.innerHTML = `* { background-color: #333; }`;
                //
                // Const w = window.open('https://toolkit.fyn.nl/docks.html', '', `left=${lastPos.x},top=${lastPos.y},width=800,height=800`);
                // W.addEventListener('DOMContentLoaded', e => {
                //     Const docks = new Docks();
                //
                //     Docks.on({
                //         Ready: e => {
                //             Docks.appendChild(window.dragTarget);
                //
                //             Docks.layout = {
                //                 Mode: Docks.vertical,
                //                 Children: [
                //                     [ 1 ],
                //                 ],
                //             };
                //         },
                //     });
                //
                //     W.document.body.appendChild(docks);
                // });
            },
        });

        this.on('content', {
            dragover: (e, t) =>
            {
                placeholder.removeAttribute('hidden');
                overlay.attributes.setOnAssert(content.getBoundingClientRect().contains(e.x, e.y) === false, 'hidden');
            },
        });

        this.on('overlay', {
            dragleave: (e, t) =>
            {
                overlay.attributes.setOnAssert(overlay.getBoundingClientRect().contains(e.x, e.y) === false, 'hidden');
            },
        });

        this.on('overlay > block', {
            dragover: (e, t) =>
            {
                t.attributes.setOnAssert(t.getBoundingClientRect().contains(e.pageX, e.pageY), 'hovering');

                const s = t.hasAttribute('static');

                let x = s
                    ? (t.hasAttribute('right') ? 98 : 0)
                    : (t.hasAttribute('right') ? 50 : 0);
                let y = s
                    ? (t.hasAttribute('bottom') ? 98 : 0)
                    : (t.hasAttribute('bottom') ? 50 : 0);
                let w = s
                    ? (t.hasAttribute('top') || t.hasAttribute('bottom') ? 100 : 2)
                    : (t.hasAttribute('top') || t.hasAttribute('bottom') || t.hasAttribute('center') ? 100 : 50);
                let h = s
                    ? (t.hasAttribute('left') || t.hasAttribute('right') ? 100 : 2)
                    : (t.hasAttribute('left') || t.hasAttribute('right') || t.hasAttribute('center') ? 100 : 50);

                placeholder.style.setProperty('--x', `${x}%`);
                placeholder.style.setProperty('--y', `${y}%`);
                placeholder.style.setProperty('--w', `${w}%`);
                placeholder.style.setProperty('--h', `${h}%`);
            },
            dragleave: (e, t) =>
            {
                t.removeAttribute('hovering');

                placeholder.style.setProperty('--x', '0');
                placeholder.style.setProperty('--y', '0');
                placeholder.style.setProperty('--w', '0');
                placeholder.style.setProperty('--h', '0');
            },
            drop: Fyn.Event.throttle(1, (e, t) =>
            {
                if(window.dragTarget === undefined)
                {
                    return;
                }

                const names = [ 'top', 'left', 'center', 'right', 'bottom' ];

                this.emit('dropped', {
                    slot: Array.from(t.attributes, a => a.name).filter(n => names.includes(n)).last,
                    edge: t.hasAttribute('static'),
                    path: [],
                    zone: this,
                    target: window.dragTarget,
                    source: window.dragSource,
                }, true);

                window.dragTarget = undefined;
                window.dragSource = undefined;

                if(window.dragPreview === undefined)
                {
                    return;
                }

                window.dragPreview.remove();
                window.dragPreview = undefined;
            }),
        });
    }

    add(tab, title = '')
    {
        if((tab instanceof HTMLElement) !== true)
        {
            throw new Error('expected tab to be a html-element');
        }

        this.tabs.forEach(t => t.removeAttribute('active'));

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

        this.appendChild(tab);
    }

    get tabs()
    {
        return this.shadow.querySelector('content > slot').assignedElements({ flatten: true });
    }
}
