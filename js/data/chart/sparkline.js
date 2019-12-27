import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts@3.11.1/dist/apexcharts.esm.js';

export default class Sparkline extends Fyn.Component
{
    static get properties()
    {
        return {
            label: Types.String,
            value: Types.String,
        };
    }

    ready()
    {
        const randomizeArray = array => {
            let currentIndex = array.length;
            let out = [];
            let randomIndex;

            while (0 !== currentIndex)
            {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                out[currentIndex] = array[randomIndex];
            }

            return out;
        };

        const chart = new ApexCharts(this.shadow.querySelector('#chart'), {
            chart: {
                type: 'line',
                height: 50,
                sparkline: {
                    enabled: true,
                },
            },
            series: [
                {
                    name: 'sales',
                    data: randomizeArray([30, 40, 35, 50, 49, 60, 70, 91, 125]),
                },
            ],
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
            },
            yaxis: {
                min: 0
            },
        });
        chart.render();
    }
}
