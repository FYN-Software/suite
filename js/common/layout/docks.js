import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';
import Resizable from './resizable.js';
import Tabs from './tabs.js';

export default class Docks extends Fyn.Component
{
    static get vertical() { return '__vertical__'; }

    static get horizontal() { return '__horizontal__'; }

    static get properties()
    {
        return {
            mode: Docks.vertical,
            layout: [],
            parent: null,
        };
    }

    static get dependencies()
    {
        return [ 'fyn-common-layout-resizable', 'fyn-common-layout-tabs' ];
    }

    initialize()
    {
        this.observe({
            layout: {
                set: v =>
{
                    if(typeof v === 'object' && v.hasOwnProperty('children'))
                    {
                        const cb = c => c instanceof Object && c.hasOwnProperty('children')
                            ? c.children.filter(cb)
                            : (Array.isArray(c)
                                ? c.filter(cb)
                                : c !== undefined
                            );

                        v.children = v.children.filter(cb);
                    }

                    return v;
                },
                changed: (o, n) =>
{
                    this.draw();
                },
            },
        });
    }

    ready()
    {
        const content = this.shadow.querySelector('content');

        content.style.gridTemplateColumns = Array(
            this.shadow.querySelectorAll('content > fyn-common-layout-resizable').length
        )
            .fill('auto')
            .join(' ');

        this.on('content > fyn-common-layout-resizable', {
            options: { passive: false },
            resize: (e, t) =>
{
                e.preventDefault();

                let sizes = Array.from(t.children, c => window.getComputedStyle(c))
                    .map(c => ({
                        min: Number.parseInt(c.getPropertyValue('min-width')) || -Infinity,
                        max: Number.parseInt(c.getPropertyValue('max-width')) || Infinity,
                    }))
                    .reduce(
                        (t, c) => ({ min: Math.max(t.min, c.min), max: Math.min(t.max, c.max) }),
                        { min: -Infinity, max: Infinity }
                    );

                let mode = this.mode === Docks.vertical ? 1 : 0;
                let template = [ `gridTemplate${[ 'Rows', 'Columns' ][mode]}` ];

                let s = e.detail.size[mode ? 'x' : 'y'];
                let cols = content.style[template].split(' ');

                cols[t.index()] = `${Math.clamp(sizes.min, sizes.max, s)}px`;

                content.style[template] = cols.join(' ');
            },
        });

        this.on({
            options: { capture: true },
            dropped: Fyn.Event.debounce(1, (e, t) =>
{
                e.detail.path.push(this);

                if(this.parent !== null)
                {
                    return;
                }

                const findPath = (id, tree) =>
{
                    let path = [];

                    for(let [ i, c ] of tree.entries())
                    {
                        if(Array.isArray(c) && c.includes(id))
                        {
                            return [ i, c.findIndex(i => i === id) ];
                        }
                        else if(c.hasOwnProperty('children'))
                        {
                            let p = findPath(id, c.children);

                            path.push(i, ...p);

                            if(p.length > 0)
                            {
                                break;
                            }
                        }
                    }

                    return path;
                };
                const findPathToRoot = el =>
{
                    let path = [];

                    if(el instanceof Tabs)
                    {
                        path.push(...findPathToRoot(el.parentElement), el.parentElement.index());
                    }
                    else if(el instanceof Resizable)
                    {
                        const o = el.ownerComponent;

                        if(o !== this)
                        {
                            path.push(...findPathToRoot(o.parentElement), o.parentElement.index());
                        }
                    }

                    return path;
                };

                const { slot, edge, target, path, zone } = e.detail;
                const id = Number.parseInt(target.name);
                const layout = Fyn.Extends.clone(this.layout);
                const oldPath = findPath(id, layout.children);
                const newPath = findPathToRoot(zone);

                let placement;
                let generate = false;

                switch(slot)
                {
                    case 'top':
                        placement = 'before';
                        generate = path.first.mode === Docks.vertical;

                        break;

                    case 'left':
                        placement = 'before';
                        generate = path.first.mode === Docks.horizontal;

                        break;

                    case 'right':
                        placement = 'after';
                        generate = path.first.mode === Docks.horizontal;

                        break;

                    case 'bottom':
                        placement = 'after';
                        generate = path.first.mode === Docks.vertical;
                }

                // TODO(Chris Kruining)
                // Implement `edge` behavior
                const mutateTree = (tree, path = []) =>
{
                    for(let [ i, c ] of tree.children.entries())
                    {
                        let p = [ ...path, i ];

                        if(Array.isArray(c))
                        {
                            if(p.compare(oldPath.slice(0, -1)))
                            {
                                delete c[oldPath.last];
                            }

                            if(p.compare(newPath))
                            {
                                if(placement === undefined)
                                {
                                    c.push(id);
                                }
                                else
                                {
                                    let t = tree;

                                    if(generate === true)
                                    {
                                        c = {
                                            mode: tree.mode === Docks.horizontal
                                                ? Docks.vertical
                                                : Docks.horizontal,
                                            children: [ c ],
                                        };

                                        t = c;
                                    }

                                    const o = placement === 'after'
                                        ? 1
                                        : 0;

                                    t.children.splice(i + o, 0, [ id ]);
                                }
                            }

                            tree.children[i] = c;

                            if(Array.isArray(c) && c.filter(i => i !== undefined).length === 0)
                            {
                                delete tree.children[i];
                            }
                        }
                        else if(c.hasOwnProperty('children'))
                        {
                            c = mutateTree(c, p);

                            if(c.children.length === 1)
                            {
                                c = tree.children.first;
                            }

                            tree.children[i] = c;
                        }
                    }

                    return tree;
                };

                this.layout = mutateTree(layout);
            }),
        });

        this.draw();
    }

    // TODO(Chris Kruining)
    // Figure out how to reuse
    // Elements instead of simply
    // Redrawing everything
    draw()
    {
        if((this.layout instanceof Object) !== true || Array.isArray(this.layout))
        {
            return;
        }

        this.mode = this.layout.mode || Docks.vertical;

        this.shadow.querySelectorAll('content > *').clear();

        const content = this.shadow.querySelector('content');

        for(let i of this.layout.children)
        {
            const item = new Resizable();
            item.on({
                ready: () =>
{
                    item.mode = this.mode;
                    item.handle = i !== this.layout.children.last;
                },
            });
            content.appendChild(item);

            Object.defineProperty(item, 'ownerComponent', { value: this, writable: false });

            if(i instanceof Object && i.hasOwnProperty('children'))
            {
                const docks = new Docks();
                docks.on({
                    ready: e =>
{
                        docks.layout = i;
                        docks.parent = this;

                        const cb = c => c instanceof Object && c.hasOwnProperty('children')
                            ? c.children.flatMap(cb)
                            : c;

                        for(let t of i.children.flatMap(cb))
                        {
                            const slot = document.createElement('slot');
                            slot.name = t;
                            slot.slot = t;

                            docks.appendChild(slot);
                        }
                    },
                });

                item.appendChild(docks);
            }
            else if(Array.isArray(i))
            {
                const tabs = new Tabs();
                tabs.on({
                    ready: e =>
{
                        for(let t of i)
                        {
                            const slot = document.createElement('slot');
                            slot.name = t;

                            tabs.appendChild(slot);
                        }
                    },
                });

                item.appendChild(tabs);
            }
        }

        if(this.layout.hasOwnProperty('sizes'))
        {
            for(let [ i, s ] of this.layout.sizes.entries())
            {
                const t = content.children[i];

                let sizes = Array.from(t.children, c => window.getComputedStyle(c))
                    .map(c => ({
                        min: Number.parseInt(c.getPropertyValue('min-width')) || -Infinity,
                        max: Number.parseInt(c.getPropertyValue('max-width')) || Infinity,
                    }))
                    .reduce(
                        (t, c) => ({ min: Math.max(t.min, c.min), max: Math.min(t.max, c.max) }),
                        { min: -Infinity, max: Infinity }
                    );

                let mode = this.mode === Docks.vertical ? 1 : 0;
                let template = [ `gridTemplate${[ 'Rows', 'Columns' ][mode]}` ];

                let cols = content.style[template].split(' ');

                cols[t.index()] = s !== null
                    ? `${Math.clamp(sizes.min, sizes.max, s)}px`
                    : 'auto';

                content.style[template] = cols.join(' ');
            }
        }
    }
}
