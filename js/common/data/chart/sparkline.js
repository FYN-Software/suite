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

    async ready()
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
                id: this.id,
                group: this.group,
                foreColor: 'var(--plain-fg)',
                sparkline: {
                    enabled: true,
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
                    data: randomizeArray([30, 40, 35, 50, 49, 60, 70, 91, 125]),
                },
            ],
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
            },
            yaxis: {
                min: 0,
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

        await Promise.delay(0);

        chart.render();
    }
}
