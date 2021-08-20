import FormAssociated from '@fyn-software/component/formAssociated.js';
declare type DropdownEvents<TValue> = {
    change: {
        old: TValue;
        new: TValue;
    };
};
export default class Dropdown<TValue = any> extends FormAssociated<Dropdown<TValue>, DropdownEvents<TValue>, TValue> {
    static localName: string;
    static styles: string[];
    private _options;
    private _container;
    options: Array<TValue>;
    index: number;
    search: string;
    placeholder: string;
    filterable: boolean;
    filter: (filter: string, option: TValue) => Promise<boolean>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    get optionElements(): Element[];
    private _renderValue;
    private _setWidth;
    private _update;
    private _findIndex;
}
export {};
//# sourceMappingURL=dropdown.d.ts.map