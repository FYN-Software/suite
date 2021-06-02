import Component from '@fyn-software/component/component.js';
export declare type ButtonEventsMap = {
    click: {
        action: string;
    };
};
export default class Button extends Component<Button> {
    static localName: string;
    static styles: string[];
    icons: Array<string>;
    iconType: string;
    action: string;
    tooltip: string;
    multi: boolean;
    togglable: boolean;
    state: boolean;
    initialize(): Promise<void>;
    ready(): Promise<void>;
}
//# sourceMappingURL=button.d.ts.map