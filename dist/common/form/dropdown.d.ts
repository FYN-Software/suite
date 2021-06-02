import FormAssociated from '@fyn-software/component/formAssociated.js';
import For from '@fyn-software/component/directive/for.js';
export default class Dropdown<TValue = any> extends FormAssociated<Dropdown<TValue>, TValue> {
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
    get _optionsForDirective(): For<Dropdown<TValue>>;
    _renderValue(): void;
    _setWidth(): void;
    _update(): Promise<void>;
    _findIndex(value: TValue): number;
}
//# sourceMappingURL=dropdown.d.ts.map