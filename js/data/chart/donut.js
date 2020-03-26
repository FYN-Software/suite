import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts@3.11.1/dist/apexcharts.esm.js';

export default class Donut extends Fyn.Component
{
    static localName = 'fyn-data-chart-donut';
    static styles = [ 'fyn.suite.base', 'fyn.suite.apexcharts', 'global.theme' ];

    static get properties()
    {
        return {
            label: Types.String,
            legend: Types.Boolean.default(false),
            group: Types.String,
            data: Types.List.type(Types.Number),
        };
    }

    async ready()
    {
        const chart = new ApexCharts(this.shadow.querySelector('#chart'), {
            chart: {
                type: 'donut',
                id: this.id,
                group: this.group,
                foreColor: 'var(--plain-fg)',
            },
            plotOptions: {
                pie: {
                    offsetY: 20,
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                show: false,
                            },
                            value: {
                                offsetY: 0,
                            },
                            total: {
                                show: true,
                                color: '#eee',
                            },
                        },
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 0,
            },
            series: [],
            labels: [ 'TODO', 'In progress', 'Declined', 'Passed' ],
            colors:['#5bc0de', '#f0ad4e', '#d9534f', '#5cb85c'],
            legend: {
                show: this.legend,
                position: 'left',
            },
        });

        chart.render();
        chart.updateSeries(this.data);

        this.observe({
            data: (o, n) => chart.updateSeries(this.data),
        });
    }
}
