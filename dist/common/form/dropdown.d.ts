import FormAssociated from '@fyn-software/component/formAssociated.js';
declare type DropdownEvents<TValue> = {
    change: {
        old: TValue;
        new: TValue;
    };
};
export default class Dropdown<TValue = any> extends FormAssociated<Dropdown<TValue>, DropdownEvents<TValue>, TValue> {
    #private;
    static readonly localName = "fyn-common-form-dropdown";
    static readonly styles: string[];
    private _internalOptions;
    options: Array<TValue>;
    index: number;
    search: string;
    placeholder: string;
    filterable: boolean;
    filter: (filter: string, option: TValue) => Promise<boolean>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
export {};
//# sourceMappingURL=dropdown.d.ts.map