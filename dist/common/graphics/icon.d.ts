import Component from '@fyn-software/component/component.js';
export default class Icon extends Component<Icon, {}> {
    #private;
    static localName: string;
    static styles: string[];
    type: string;
    initialize(): Promise<void>;
    ready(): Promise<void>;
    get icons(): Array<string>;
    set icons(v: any);
}
//# sourceMappingURL=icon.d.ts.map