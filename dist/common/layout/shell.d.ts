import Component from '@fyn-software/component/component.js';
declare type ShellEvents = {};
export default class Shell extends Component<Shell, ShellEvents> {
    static localName: string;
    static styles: string[];
    title: string;
    protected initialize(): Promise<void>;
    ready(): Promise<void>;
}
export {};
//# sourceMappingURL=shell.d.ts.map