import Component from '@fyn-software/component/component.js';
export declare enum Fit {
    auto = "auto",
    cover = "cover",
    contain = "contain"
}
export default class Image extends Component<Image> {
    static localName: string;
    static styles: string[];
    src: string;
    alt: string;
    fit: Fit;
    loading: boolean;
    protected initialize(): Promise<void>;
    protected ready(): Promise<void>;
}
//# sourceMappingURL=image.d.ts.map