import FormAssociated from '@fyn-software/component/formAssociated.js';
export default class Datetime extends FormAssociated<Datetime, {
    change: {
        old: Date;
        new: Date;
    };
}, Date> {
    static localName: string;
    static styles: string[];
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
//# sourceMappingURL=datetime.d.ts.map