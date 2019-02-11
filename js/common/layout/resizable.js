import * as Fyn from '../../../../component/fyn.js';

const vertical = Symbol('vertical');
const horizontal = Symbol('horizontal');

export default class Resizable extends Fyn.Component
{
    static get direction()
    {
        return {
            vertical,
            horizontal,
        };
    }

    static get properties()
    {
        return {
            mode: vertical,
            handle: true,
        };
    }

    initialize()
    {
        this.observe({
            mode: {
                set: v => {
                    if(Object.values(Resizable.direction).includes(v) === false)
                    {
                        throw new Error(`Expected mode to be a value of Resizable.direction, got ${v}`);
                    }

                    return v;
                },
            },
        });

        let start = null;
        let size = null;
        let id = null;

        this.on('handle', {
            options: { passive: false },
            pointerdown: e =>
            {
                e.preventDefault();
                e.stopPropagation();

                start = { x: e.pageX, y: e.pageY };
                size = this.getBoundingClientRect();
                id = e.pointerId;

                this.setAttribute('resizing', '');
            },
        });

        document.body.on({
            options: { passive: false },
            pointermove: e =>
            {
                e.preventDefault();
                e.stopPropagation();

                if(e.pointerId === id)
                {
                    const delta = { x: e.pageX - start.x, y: e.pageY - start.y };

                    this.emit('resize', {
                        start,
                        delta,
                        size: { x: size.width + delta.x, y: size.height + delta.y },
                    });
                }
            },
            pointerup: e =>
            {
                e.preventDefault();
                e.stopPropagation();

                if(e.pointerId === id)
                {
                    start = null;
                    size = null;
                    id = null;

                    this.removeAttribute('resizing');
                }
            },
        });
    }

    get scrollWidth()
    {
        return this.shadow.querySelector('content').scrollWidth;
    }

    get offsetWidth()
    {
        return this.shadow.querySelector('content').offsetWidth;
    }
}
