import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import Media, { Preference } from '@fyn-software/core/media.js';

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
    public loading: boolean = false;

    @property()
    public insecure: boolean = false;

    @property()
    public alt: string = '';

    @property<Image>({ bindToCSS: v => String(v) })
    public fit: Fit = Fit.contain;

    @property()
    public src: string = '';

    protected async initialize(): Promise<void>
    {
        this.observe({
            src: async (o: string, n: string) => {
                if(n === undefined || n === '' || Media.prefers(Preference.reducedData))
                {
                    return;
                }

                this.loading = true;

                this.$.img?.remove();

                // TODO(Chris Kruining)
                //  There's a weird timing issue with
                //  the `insecure` property the delay
                //  0 fixes it, but no clue why
                await Promise.delay(0);

                const img = document.createElement('img');
                img.onload = () => {
                    this.shadow.appendChild(img);
                    this.loading = false;
                };
                img.onerror = () => {
                    this.loading = false;
                };
                img.alt = this.alt ?? this.src;
                img.draggable = false;
                // TODO(Chris Kruining) change this back to property setter when typescript updates the API
                // img.part = 'img';
                img.setAttribute('part', 'img');
                img.id = 'img';

                if(this.insecure !== true)
                {
                    img.crossOrigin = 'anonymous';
                }

                img.src = String(this.src);
            },
            alt: () => {
                if(Media.prefers(Preference.reducedData) === false)
                {
                    return;
                }

                this.shadow.textContent = this.alt;
            },
        });
    }

    protected async ready(): Promise<void>
    {

    }
}