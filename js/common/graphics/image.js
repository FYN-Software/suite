'use strict';

import Component from '/js/component.js';

export default class Image extends Component
{
    constructor()
    {
        super();

        // this.observe('src', () => this.load());

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
        img.onload = () => {
            this.shadow.appendChild(img);
            this.removeAttribute('loading');
        };
        img.onerror = () => {
            this.removeAttribute('loading');
        };
        img.src = this.getAttribute('src');
    }
}