import FormAssociated from '@fyn-software/component/formAssociated.js';
export declare type InputEvents = {
    change: {
        old: string;
        new: string;
    };
};
export default class Input<TTYpe = string | number | Date> extends FormAssociated<Input<TTYpe>, InputEvents, TTYpe> {
    static localName: string;
    static styles: string[];
    placeholder: string;
    regex: string;
    inputmode: string;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    focus(): void;
}
//# sourceMappingURL=input.d.ts.map