import FormAssociated from '@fyn-software/component/formAssociated.js';
interface IColor {
}
declare class Hlsa implements IColor {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
}
export default class Color extends FormAssociated<Color, Hlsa> {
    static localName: string;
    static styles: string[];
    constructor(...args: Array<any>);
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
export {};
//# sourceMappingURL=color.d.ts.map