import Component from '@fyn-software/component/component.js';
declare type DialogEvents = {
    shown: void;
    closed: void;
};
export default class Dialog extends Component<Dialog, DialogEvents> {
    static localName: string;
    static styles: string[];
    title: string;
    img: string;
    inlineSize: number;
    blockSize: number;
    insetInlineStart: number;
    insetBlockStart: number;
    resizable: boolean;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    open(): Promise<void>;
    close(): Promise<void>;
    show<T = void>(): Promise<T | false>;
}
export {};
//# sourceMappingURL=dialog.d.ts.map