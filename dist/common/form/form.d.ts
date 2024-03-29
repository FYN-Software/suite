import Component from '@fyn-software/component/component.js';
import FormAssociated from '@fyn-software/component/formAssociated.js';
declare type FormEvents = {
    success: {
        success: true;
        [key: string]: any;
    };
    cancel: {
        success: false;
    };
};
export default class Form extends Component<Form, FormEvents> {
    static localName: string;
    static styles: string[];
    title: string;
    action: string;
    messages: Array<string>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    submit(): any;
    clear(): void;
    get elements(): Array<FormAssociated<any, any>>;
}
export {};
//# sourceMappingURL=form.d.ts.map