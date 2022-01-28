import Dialog from './dialog.js';
export default class Picker extends Dialog {
    static localName: string;
    static styles: string[];
    items: Array<any>;
    constructor(...args: Array<any>);
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    show<T>(items?: T[]): Promise<T | false>;
}
//# sourceMappingURL=picker.d.ts.map