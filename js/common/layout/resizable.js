import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export class Direction extends Types.Enum.define({
    vertical: Symbol('vertical'),
    horizontal: Symbol('horizontal'),
}){}

export default class Resizable extends Fyn.Component
{
    static get properties()
    {
        return {
            mode: Direction.default(Direction.vertical),
            handle: Types.Boolean.default(true),
        };
    }

    initialize()
    {
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
