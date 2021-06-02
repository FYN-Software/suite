import FormAssociated from '@fyn-software/component/formAssociated.js';
export default class Checkbox extends FormAssociated<Checkbox, boolean | undefined> {
    static localName: string;
    static styles: string[];
    toggle: boolean;
    checked?: boolean;
    locked: boolean;
    closable: boolean;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
//# sourceMappingURL=checkbox.d.ts.map