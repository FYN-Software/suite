import * as Fyn from '../../../../component/fyn.js';

export default class Image extends Fyn.Component
{
    static get properties()
    {
        return {
            src: Fyn.Data.String(''),
            loading: Fyn.Data.Boolean(true),
        };
    }

    initialize()
    {
        this.src.on({
            changed: (o, n) => {
                this.loading = true;
                this.shadow.querySelectorAll('img').forEach(i => this.shadow.removeChild(i));

                const img = document.createElement('img');
                img.onload = () =>
                {
                    this.shadow.appendChild(img);
                    this.loading = false;
                };
                img.onerror = () =>
                {
                    this.loading = false;
                };
                img.src = this.src;
            },
        });
    }
}
