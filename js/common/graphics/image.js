import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export const Fit = Types.Enum.define({
    auto: 'auto',
    cover: 'cover',
    contain: 'contain',
});

export default class Image extends Fyn.Component
{
    static localName = 'fyn-common-graphics-image';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    static get properties()
    {
        return {
            src: Types.String,
            alt: Types.String,
            fit: Fit.default(Fit.auto),
            loading: Types.Boolean.default(true),
        };
    }

    initialize()
    {
        let img = document.createElement('img');
        img.crossOrigin = 'anonymous';

        this.observe({
            src: (o, n) => {
                this.loading = true;
                this.setAttribute('loading', '');
                this.shadow.querySelectorAll('img').forEach(i => this.shadow.removeChild(i));

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
                img.alt = this.alt || this.src;
                img.draggable = false;
                img.part = 'img'
            },
            fit: (o, n) => {
                if(img === undefined)
                {
                    return;
                }

                img.style.setProperty('--fit', Fit.valueOf(n));
            },
        });
    }
}
