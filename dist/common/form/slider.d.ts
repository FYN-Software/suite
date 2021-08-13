import FormAssociated from '@fyn-software/component/formAssociated.js';
declare type SliderEvents = {
    input: {
        value: number;
    };
};
export default class Slider extends FormAssociated<Slider, SliderEvents, number> {
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
export {};
//# sourceMappingURL=slider.d.ts.map