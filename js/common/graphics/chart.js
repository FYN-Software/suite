import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Chart extends Fyn.Component
{
    static get properties()
    {
        return {
            type: 'line',
            interpolation: 'spline',
        };
    }

    ready()
    {
        const c = this.shadow.getElementById('c');
        const ctx = c.getContext('2d');
    }
}
