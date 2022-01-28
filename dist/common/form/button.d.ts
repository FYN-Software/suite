import Component from '@fyn-software/component/component.js';
declare type ButtonEvents = {
    click: {
        action: string;
    };
};
export default class Button extends Component<Button, ButtonEvents> {
    static localName: string;
    static styles: string[];
    action: string;
    tooltip: string;
    togglable: boolean;
    state: boolean;
    disabled: boolean;
    initialize(): Promise<void>;
    ready(): Promise<void>;
}
export {};
//# sourceMappingURL=button.d.ts.map