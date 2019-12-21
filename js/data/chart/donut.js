import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';
// import ApexCharts from 'https://unpkg.com/apexcharts@3.7.0/dist/apexcharts.esm.js';
import ApexCharts from '/js/apex.js';

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
                height: 120,
            },
            dataLabels: {
                enabled: false
            },
            series: [],
            labels: [ 'TODO', 'In progress', 'Declined', 'Passed' ],
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
