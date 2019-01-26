import * as Fyn from '../../../../component/fyn.js';

export default class Progress extends Fyn.Component
{
    static get properties()
    {
        return {
            value: 0.0,
        };
    }

    initialize()
    {
        this.observe({
            value: {
                set: v => Math.clamp(0, 1, Number.parseFloat(v)),
                changed: (o, n) => {
                    this.shadow.querySelector('value').style.width = `${n * 100 }%`;
                },
            },
        });
    }
}