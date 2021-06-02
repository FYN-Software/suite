import Component from '@fyn-software/component/component.js';
export declare enum Mode {
    static = 0,
    grow = 1
}
export default class Dialog extends Component<Dialog> {
    static localName: string;
    static styles: string[];
    title: string;
    img: string;
    width: number;
    height: number;
    left: number;
    top: number;
    mode: Mode;
    resizable: boolean;
    static get animations(): AnimationConfig;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    open(): Promise<Animation | null>;
    close(): Promise<Animation | null>;
    show(modal?: boolean): Promise<boolean>;
}
//# sourceMappingURL=dialog.d.ts.map