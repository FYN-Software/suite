import Component from '@fyn-software/component/component.js';
export declare type Key = {
    key: string;
    ctrl: boolean;
    shift: boolean;
    meta: boolean;
};
export declare type Command = {
    name: string;
    icon: string;
    keys?: Array<Key>;
    action(): void;
};
export declare type GroupedCommandList = Array<{
    [key: string]: Command;
}>;
export default class Context extends Component<Context> {
    static localName: string;
    static styles: string[];
    commands: GroupedCommandList;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    close(): void;
    static for(node: Node, commands: GroupedCommandList): Context;
}
//# sourceMappingURL=context.d.ts.map