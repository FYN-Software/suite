import * as Fyn from '../../../../component/fyn.js';

export default class Image extends Fyn.Component
{
    static get properties()
    {
        return {
            src: Fyn.Data.String.default(''),
            loading: Fyn.Data.Boolean.default(true),
        };
    }

    initialize()
    {
        this.observe({
            src: {
                changed: e => {
                    this.loading = true;
                    this.setAttribute('loading', '');
                    this.shadow.querySelectorAll('img').forEach(i => this.shadow.removeChild(i));

                    const img = document.createElement('img');
                    img.onload = () =>
                    {
                        this.shadow.appendChild(img);
                        this.loading = false;
                        this.removeAttribute('loading');
                    };
                    img.onerror = () =>
                    {
                        this.loading = false;
                        this.removeAttribute('loading');
                    };
                    img.src = String(this.src);
                },
            },
        });
    }
}
