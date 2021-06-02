import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export enum Fit
{
    auto = 'auto',
    cover = 'cover',
    contain = 'contain',
}

export default class Image extends Component<Image>
{
    static localName = 'fyn-common-graphics-image';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    @property()
    public src: string = '';

    @property()
    public alt: string = '';

    @property()
    public fit: Fit = Fit.auto;

    @property()
    public loading: boolean = true;

    protected async initialize(): Promise<void>
    {
        let img = document.createElement('img');
        img.crossOrigin = 'anonymous';

        this.observe({
            src: (o: string, n: string) => {
                if(n === undefined || n.includes('{{') || n.includes('}}') || n.includes('{#') || this.src === '')
                {
                    return;
                }

                this.loading = true;
                this.setAttribute('loading', '');

                this.$.img?.remove();

                img = document.createElement('img');
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    this.shadow.appendChild(img);
                    this.loading = false;
                    this.removeAttribute('loading');
                };
                img.onerror = () => {
                    this.loading = false;
                    this.removeAttribute('loading');
                };
                img.src = String(this.src);
                img.alt = this.alt ?? this.src;
                img.draggable = false;
                // TODO(Chris Kruining) change this back to property setter when typescript updates the API
                // img.part = 'img';
                this.setAttribute('part', 'img');
                img.id = 'img';
            },
            fit: async () => {
                this.shadow.setProperty('--fit', this.fit);
            },
        });
    }

    protected async ready(): Promise<void>
    {
    }
}