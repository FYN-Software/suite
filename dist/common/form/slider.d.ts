import FormAssociated from '@fyn-software/component/formAssociated.js';
export default class Slider extends FormAssociated<Slider, number> {
    static localName: string;
    static styles: string[];
    step: number;
    min: number;
    max: number;
    showPercentage: boolean;
    showValue: boolean;
    vertical: boolean;
    snaps: Array<number>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    private valueToPercentage;
}
//# sourceMappingURL=slider.d.ts.map