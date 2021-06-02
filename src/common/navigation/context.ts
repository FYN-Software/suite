import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export type Key = {
    key: string,
    ctrl: boolean,
    shift: boolean,
    meta: boolean,
};

export type Command = {
    name: string,
    icon: string,
    keys?: Array<Key>,
    action(): void,
};

export type GroupedCommandList = Array<{ [key: string]: Command }>;

export default class Context extends Component<Context>
{
    static localName = 'fyn-common-navigation-context';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    @property()
    public commands: GroupedCommandList = [];

    protected async initialize(): Promise<void>
    {

    }

    protected async ready(): Promise<void>
    {
        this.shadow.on({
            options: {
                passive: false,
            },
            contextmenu: e => {
                e.preventDefault();
                e.stopPropagation();
            },
        });

        this.shadow.on('fyn-common-graphics-icon', {
            click: (e, t) => {
                this.commands.reduce((t, g) => ({ ...t, ...g}), {})[t.id]?.action();
            },
        });

        window.on({ 'click|blur': this.close.bind(this) });
    }

    close()
    {
        this.removeAttribute('open');
    }

    static for(node: Node, commands: GroupedCommandList)
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
                inst.focus();
            },
        });

        return inst;
    }
}