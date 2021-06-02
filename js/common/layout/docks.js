import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';
import { Position } from '@fyn-software/suite/js/common/layout/tabs.js';

export const Resize = Types.Enum.define({
    none: {  },
    inline: {  },
    block: {  },
});
export const Cell = Types.Object.define({
    area: Types.String,
    docked: Position.default(Position.none),
    static: Types.Boolean.default(false),
    resize: Resize.default(Resize.none),
});

export default class Docks extends Fyn.Component
{
    static localName = 'fyn-common-layout-docks';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            grid: Types.String,
            cells: Types.List.type(Cell),
            closable: Types.Boolean,
        };
    }

    async initialize()
    {
    }

    async ready()
    {
        this.shadow.on('fyn-common-layout-tabs.docked', {
            switched: ({ index }, t) => {
                t.attributes.setOnAssert(index > -1, 'open');
            },
        })
    }

    async add(cell, element, title, closable)
    {
        if(cell < 0 || cell >= this.cells.length)
        {
            throw new Error(`The cell given is not within a valid range`);
        }

        element.setAttribute('slot', cell);
        element.setAttribute('tab-title', title);
        element.setAttribute('tab-closable', closable);

        this.appendChild(element);
        const _ = element.getBoundingClientRect();

        await this.isReady;

        const tabs = this.$[cell];

        tabs.index = tabs.tabs.length - 1;
    }

    get Position()
    {
        return Position;
    }

    get Resize()
    {
        return Resize;
    }
}
