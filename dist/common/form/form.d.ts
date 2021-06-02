import Component from '@fyn-software/component/component.js';
import FormAssociated from '@fyn-software/component/formAssociated.js';
export default class Form extends Component<Form> {
    static localName: string;
    static styles: string[];
    title: string;
    action: string;
    messages: Array<string>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    submit(): {} | undefined;
    clear(): void;
    get elements(): Array<FormAssociated<any, any>>;
}
//# sourceMappingURL=form.d.ts.map