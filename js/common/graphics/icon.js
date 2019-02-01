import * as Fyn from '../../../../component/fyn.js';

export default class Icon extends Fyn.Component
{
    static get properties()
    {
        return {
            icons: [],
            type: 'fas',
        };
    }

    initialize()
    {
        this.observe({
            icons: {
                set: v =>
                {
                    if(v === undefined || v === null || typeof v === 'boolean')
                    {
                        v = [];
                    }

                    if(Array.isArray(v) !== true)
                    {
                        v = JSON.tryParse(v.replace(/'/g, '"'));
                    }

                    if(Array.isArray(v) !== true)
                    {
                        v = [ v ];
                    }

                    return v;
                },
                changed: (o, n) =>
                {
                },
            },
        });
    }
}
