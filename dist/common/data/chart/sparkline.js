var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts@3.11.1/dist/apexcharts.esm.js';
export default class Sparkline extends Component {
    constructor() {
        super(...arguments);
        this.label = '';
        this.value = '';
        this.group = '';
        this._data = [30, 40, 35, 50, 49, 60, 70, 91, 125].sort(() => 0.5 - Math.random()).map((it, i) => ({ x: i, y: it }));
    }
    async initialize() {
    }
    async ready() {
        void await this.render();
    }
    async render() {
        this._chart = new ApexCharts(this.shadow.querySelector('#chart'), {
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
                    data: this._data,
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
            colors: ['_eee'],
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: (val) => '',
                    }
                }
            }
        });
        this._chart.render();
        setInterval(() => {
            this._data.push({
                x: this._data.length,
                y: Math.floor(Math.random() * 100),
            });
            this._chart.updateSeries([
                {
                    name: 'sales',
                    data: this._data,
                },
            ]);
        }, 1000);
    }
}
Sparkline.localName = 'fyn-common-data-chart-sparkline';
Sparkline.styles = ['fyn.suite.base', 'fyn.suite.apexcharts', 'global.theme'];
__decorate([
    property()
], Sparkline.prototype, "label", void 0);
__decorate([
    property()
], Sparkline.prototype, "value", void 0);
__decorate([
    property()
], Sparkline.prototype, "group", void 0);
//# sourceMappingURL=sparkline.js.map