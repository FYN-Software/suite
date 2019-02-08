import * as Fyn from '../../../../component/fyn.js';
import Image from '../graphics/image.js';

export default class List extends Fyn.Component
{
    static get properties()
    {
        return {
            sortable: false,
        };
    }

    ready()
    {
        this.observe({
            sortable: {
                set: v =>
                {
                    if(typeof v === 'boolean')
                    {
                        return v;
                    }
                    else if(v === '')
                    {
                        return true;
                    }

                    return false;
                },
                changed: (o, n) =>
                {
                    this.items.forEach(i => i.draggable = this.sortable);
                },
            },
        });

        this.on('slot', {
            slotchange: e => {
                this.items.forEach(i => i.draggable = this.sortable);
            },
        });

        let target;
        let start;
        let position;
        let animating = false;

        this.on({
            dragstart: Fyn.Event.debounce(1, e =>
            {
                console.log('kaas');

                target = e.path[0];

                start = e.x;
                position = e.x;
            }),
        });

        document.body.on({
            dragover: e =>
            {
                if(target === null || target === undefined || animating === true)
                {
                    return;
                }

                position = e.x;

                const d = position - start;
                const p = Math.abs(d) / (d);
                const sibling = target[`${ p === -1 ? 'previous' : 'next' }Sibling`];

                if(sibling === null)
                {
                    return;
                }

                const rect = sibling.getBoundingClientRect();
                const v = (start + (d) - rect.left)  / rect.width;

                if((p === -1 && v < .45) || (p === 1 && v > .55))
                {
                    animating = true;

                    const el1 = p === 1 ? target : sibling;
                    const el2 = p === 1 ? sibling : target;

                    const a1 = el1.animate(
                        [ { transform: 'translateX(0)' }, { transform: 'translateX(100%)' } ],
                        { duration: 200, easing: 'ease-in-out' }
                    );
                    const a2 = el2.animate(
                        [ { transform: 'translateX(0)' }, { transform: 'translateX(-100%)' } ],
                        { duration: 200, easing: 'ease-in-out' }
                    );

                    Promise.all([ a1.finished, a2.finished ]).then(() =>
                    {
                        target.parentNode.insertBefore(target, p === 1 ? sibling.nextSibling : sibling);
                        start = e.x;
                        animating = false;
                    });
                }
            },
            dragend: e =>
            {
                if(target === null || target === undefined)
                {
                    return;
                }

                target = null;
            },
        });
    }

    get items()
    {
        const slot = this.shadow.querySelector('slot');

        return slot !== null
            ? slot.assignedElements({ flatten: true })
            : [];
    }
}
