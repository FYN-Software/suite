import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts@3.11.1/dist/apexcharts.esm.js';

export default class Donut extends Component<Donut, {}>
{
    static localName = 'fyn-common-data-chart-donut';
    static styles = [ 'fyn.suite.base', 'fyn.suite.apexcharts' ];

    @property()
    public label: string = '';

    @property()
    public group: string = '';

    @property()
    public legend: boolean = false;

    @property()
    public data: Array<number> = [];

    protected async initialize(): Promise<void>
    {
        return Promise.resolve(undefined);
    }

    protected async ready()
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
            data: () => chart.updateSeries(this.data),
        });
    }
}
