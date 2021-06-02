import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';

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

    async initialize()
    {
        let img = document.createElement('img');
        img.crossOrigin = 'anonymous';

        this.observe({
            src: (o, n) => {
                if(n.includes('{{') || n.includes('}}') || n.includes('{#') || this.src === '')
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
                img.part = 'img';
                img.id = 'img';
            },
            fit: async (o, n) => {
                this.shadow.setProperty('--fit', Fit.valueOf(this.fit));
            },
        });
    }

    async ready()
    {
    }
}