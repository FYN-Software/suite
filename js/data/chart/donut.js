import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts@3.11.1/dist/apexcharts.esm.js';

export default class Donut extends Fyn.Component
{
    static get properties()
    {
        return {
            label: Types.String,
            data: Types.List.type(Types.Number),
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
                type: 'donut',
                height: 200,
            },
            dataLabels: {
                enabled: false
            },
            series: [],
            labels: [ 'TODO', 'In progress', 'Declined', 'Passed' ],
            colors:['#5bc0de', '#f0ad4e', '#d9534f', '#5cb85c'],
            legend: {
                show: false,
            },
            dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 3,
                opacity: 0.5
            },
        });

        chart.render();

        this.observe({
            data: (o, n) => chart.updateSeries(this.data),
        });
    }
}
