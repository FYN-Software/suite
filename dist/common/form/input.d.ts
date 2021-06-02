import FormAssociated from '@fyn-software/component/formAssociated.js';
export default class Input extends FormAssociated<Input> {
    static localName: string;
    static styles: string[];
    placeholder: string;
    regex: string;
    multiline: boolean;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    focus(): void;
}
//# sourceMappingURL=input.d.ts.map