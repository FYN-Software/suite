var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts@3.11.1/dist/apexcharts.esm.js';
export default class Donut extends Component {
    constructor() {
        super(...arguments);
        this.label = '';
        this.group = '';
        this.legend = false;
        this.data = [];
    }
    async initialize() {
        return Promise.resolve(undefined);
    }
    async ready() {
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
            labels: ['TODO', 'In progress', 'Declined', 'Passed'],
            colors: ['#5bc0de', '#f0ad4e', '#d9534f', '#5cb85c'],
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
Donut.localName = 'fyn-common-data-chart-donut';
Donut.styles = ['fyn.suite.base', 'fyn.suite.apexcharts', 'global.theme'];
__decorate([
    property()
], Donut.prototype, "label", void 0);
__decorate([
    property()
], Donut.prototype, "group", void 0);
__decorate([
    property()
], Donut.prototype, "legend", void 0);
__decorate([
    property()
], Donut.prototype, "data", void 0);
//# sourceMappingURL=donut.js.map