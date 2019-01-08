import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Image extends Fyn.Component
{
    constructor()
    {
        super();

        // This.observe('src', () => this.load());

        this.load();
    }

    load()
    {
        if(this.hasAttribute('loading'))
        {
            return;
        }

        this.setAttribute('loading', '');
        this.shadow.querySelectorAll('img').forEach(i => this.shadow.removeChild(i));

        const img = document.createElement('img');
        img.onload = () =>
{
            this.shadow.appendChild(img);
            this.removeAttribute('loading');
        };
        img.onerror = () =>
{
            this.removeAttribute('loading');
        };
        img.src = this.getAttribute('src');
    }
}
