import * as Fyn from '../../../../component/fyn.js';

export default class Image extends Fyn.Component
{
    static get properties()
    {
        return {
            src: '',
            loading: true,
        };
    }

    constructor()
    {
        super();

        this.observe({
            src: {
                set: v => v || this.src,
                changed: () => this.load(),
            },
        });
    }

    load()
    {
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
    }
}
