import Component from '../../../../component/component.js';
import * as Types from '../../../../data/types.js';

export const Type = Types.Enum.define({
    item: {},
    separator: {},
});

export default class Context extends Component
{
    static localName = 'fyn-common-navigation-context';

    static get properties()
    {
        return {
            items: Types.List.type(Types.Object.define({
                name: Types.String,
                icon: Types.String,
                action: Types.String,
                type: Type,
            })).default([
                { name: 'copy', action: 'copy', icon: 'far.copy', type: Type.item },
                { name: 'paste', action: 'paste', icon: 'paste', type: Type.item },
                { name: 'delete', action: 'delete', icon: 'times', type: Type.item },
                { type: Type.separator },
            ]),
        };
    }

    async ready()
    {
        globalThis.on({ 'click|blur': () => this.close(), })
    }

    close()
    {
        this.removeAttribute('open');
    }

    static for(node, items)
    {
        const inst = new this({ items });
        globalThis.document.body.appendChild(inst);

        node.on({
            options: {
                passive: false,
            },
            contextmenu: e => {
                e.preventDefault();
                e.stopPropagation();

                inst.style.setProperty('--x', `${e.x}px`);
                inst.style.setProperty('--y', `${e.y}px`);

                inst.setAttribute('open', '');
            },
        });

        return inst;
    }
}