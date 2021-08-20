import Component from '@fyn-software/component/component.js';
export declare enum Position {
    none = 0,
    top = 1,
    left = 2,
    right = 3,
    bottom = 4
}
export declare type Tab = {
    title: string;
    closable: boolean;
    active: boolean;
    element: Element;
};
declare type TabsEvents = {
    switched: {
        index: number;
    };
};
export default class Tabs extends Component<Tabs, TabsEvents> {
    static localName: string;
    static styles: string[];
    index: number;
    tabs: Array<Tab>;
    delimiter: string;
    closable: boolean;
    position: Position;
    private _observer;
    private _animation?;
    private _timeline?;
    initialize(): Promise<void>;
    ready(): Promise<void>;
    add(tab: Element, title?: string, closable?: boolean): void;
    get pages(): Promise<Element[]>;
    get docked(): boolean;
    private _detect;
    private _pageIterator;
    private _setIndicatorAnimation;
}
export {};
//# sourceMappingURL=tabs.d.ts.map