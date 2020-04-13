import Component from '../../../../component/component.js';
import * as Types from '../../../../data/types.js';

export const Command = Types.Object.define({
    name: Types.String,
    icon: Types.String,
    keys: Types.List.type(Types.Object.define({
        key: Types.String,
        ctrl: Types.Boolean,
        shift: Types.Boolean,
        meta: Types.Boolean,
    })),
    action: Types.Any,
});

export const GroupedCommandList = Types.List.type(Types.Object);

export default class Context extends Component
{
    static localName = 'fyn-common-navigation-context';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            commands: GroupedCommandList,
        };
    }

    async ready()
    {
        globalThis.on({ 'click|blur': this.close.bind(this) });

        globalThis.on({
            blur: e => {
                console.log(e)
            },
        });
    }

    close()
    {
        this.removeAttribute('open');
    }

    static for(node, commands)
    {
        const inst = new this({ commands });
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