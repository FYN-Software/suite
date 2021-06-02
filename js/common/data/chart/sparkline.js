import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts@3.11.1/dist/apexcharts.esm.js';

export default class Sparkline extends Fyn.Component
{
    static localName = 'fyn-common-data-chart-sparkline';
    static styles = [ 'fyn.suite.base', 'fyn.suite.apexcharts', 'global.theme' ];

    static get properties()
    {
        return {
            label: Types.String,
            value: Types.String,
            group: Types.String,
        };
    }

    #chart;
    #data = [30, 40, 35, 50, 49, 60, 70, 91, 125].sort(() => 0.5 - Math.random()).map((it, i) => ({ x: i, y: it }));

    async ready()
    {
        const _ = this.#render();
    }

    async #render()
    {
        this.#chart = new ApexCharts(this.shadow.querySelector('#chart'), {
            chart: {
                type: 'line',
                id: this.id,
                group: this.group,
                foreColor: 'var(--plain-fg)',
                // width: 500,
                sparkline: {
                    enabled: true,
                },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000
                    }
                },
                toolbar: {
                    show: false
                },
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 2,
                    opacity: 0.2,
                },
            },
            series: [
                {
                    name: 'sales',
                    data: this.#data,
                }
            ],
            dataLabels: {
                enabled: false
            },
            xaxis: {
                range: 10,
            },
            yaxis: {
                min: 0,
                max: 100,
                labels: {
                    minWidth: 10,
                },
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            colors: [ '#eee' ],
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: val => '',
                    }
                }
            }
        });

        this.#chart.render();

        setInterval(() => {
            this.#data.push({
                x: this.#data.length,
                y: Math.floor(Math.random() * 100),
            });

            this.#chart.updateSeries([
                {
                    name: 'sales',
                    data: this.#data,
                },
            ]);
        }, 1000);
    }
}
