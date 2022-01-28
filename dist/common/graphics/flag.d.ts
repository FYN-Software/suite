import Component from '@fyn-software/component/component.js';
declare type SizeKey = 'normal' | 'square';
declare type SizeInfo = {
    x: number;
    y: number;
};
export declare const Size: Record<SizeKey, SizeInfo>;
export default class Flag extends Component<Flag, {}> {
    static localName: string;
    static styles: string[];
    iso: string;
    size: SizeInfo;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
export {};
//# sourceMappingURL=flag.d.ts.map