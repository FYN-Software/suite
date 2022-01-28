import Component from '@fyn-software/component/component.js';
export declare type Action = 'next' | 'previous' | 'submit' | 'cancel';
declare type ProgressEvents = {
    submit: never;
    cancel: never;
};
export default class Progress extends Component<Progress, ProgressEvents> {
    #private;
    static localName: string;
    static styles: string[];
    steps: Array<string>;
    index: number;
    verification: (action: Action, page: Element, index: number) => Promise<true | any>;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
    get pages(): Element[];
}
export {};
//# sourceMappingURL=progress.d.ts.map