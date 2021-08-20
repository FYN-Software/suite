import Component from '@fyn-software/component/component.js';
export default class Progress extends Component<Progress, {
    submit: never;
    cancel: never;
}> {
    static localName: string;
    static styles: string[];
    steps: Array<string>;
    index: number;
    verification: any;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    get pages(): Element[];
}
//# sourceMappingURL=progress.d.ts.map