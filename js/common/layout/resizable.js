import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export class Direction extends Types.Enum.define({
    vertical: { property: 'gridTemplateColumns' },
    horizontal: { property: 'gridTemplateRows' },
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

        this.shadow.on('handle', {
            options: {
                passive: false,
            },
            pointerdown: e => {
                e.stopPropagation();

                start = { x: e.pageX, y: e.pageY };
                size = this.getBoundingClientRect();
                id = e.pointerId;

                this.setAttribute('resizing', '');
            },
        });

        document.body.on({
            options: {
                passive: false,
            },
            pointermove: e => {
                if(e.pointerId === id)
                {
                    e.stopPropagation();

                    const delta = { x: e.pageX - start.x, y: e.pageY - start.y };

                    this.emit('resize', {
                        start,
                        delta,
                        size: { x: size.width + delta.x, y: size.height + delta.y },
                    });
                }
            },
            pointerup: e => {
                if(e.pointerId === id)
                {
                    e.stopPropagation();

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
