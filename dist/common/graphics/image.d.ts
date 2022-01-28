import Component from '@fyn-software/component/component.js';
export declare enum Fit {
    auto = "auto",
    cover = "cover",
    contain = "contain"
}
export declare enum Position {
    start = "left",
    center = "center",
    end = "right"
}
export default class Image extends Component<Image, {}> {
    static localName: string;
    static styles: string[];
    loading: boolean;
    insecure: boolean;
    alt: string;
    fit: Fit;
    position: Position;
    src: string;
    filterColor?: string;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
//# sourceMappingURL=image.d.ts.map