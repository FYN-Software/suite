import * as Fyn from '../../../../component/fyn.js';

export default class Datetime extends Fyn.Component
{
    static get properties()
    {
        return {
            date: null,
            label: '',
        };
    }

    ready()
    {
        const box = this.shadow.querySelector('box');

        this.on('fyn-common-form-input', {
            click: Fyn.Event.debounce(1, () => {
                const rect = this.getBoundingClientRect();

                this.style.setProperty('--x', `${rect.x + rect.width / 2}px`);
                this.style.setProperty('--y', `${rect.bottom}px`);

                this.attributes.toggle('open');
            }),
        });

        document.body.on({
            click: (e) =>
            {
                if(e.path.includes(box) === false)
                {
                    this.removeAttribute('open');
                }
            },
        });
    }
}