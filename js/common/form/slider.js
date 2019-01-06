import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Slider extends Fyn.Component
{
    static get properties()
    {
        return {
            _percentVal: null,
            step: .1,
            value: 0,
            min: 0,
            max: 360,
            label: '',
            showPercentage: false,
            showValue: false,
            vertical: false,
        };
    }

    initialize() {
        this.observe({
            _percentVal: {
                set: v => Math.clamp(0, 1, Number.parseFloat(v) || (this.value - this.min) / (this.max - this.min)),
                changed: (o, n) => {
                    this.shadow.querySelector('box').style.setProperty('--w', `${(this._percentVal * 100).toFixed(1)}%`);

                    this.value = (this.max - this.min) * this._percentVal;
                },
            },
            value: {
                set: v => Math.clamp(this.min, this.max, Number.parseFloat(v) || 0),
                changed: (o, n) => {
                    this._percentVal = (this.value - this.min) / (this.max - this.min);

                    this.emit('change', { old: o, new: n });
                },
            },
            min: {
                set: v => Math.min(Number.parseFloat(v) || this.min, this.max),
                changed: () => this.value = this.value,
            },
            max: {
                set: v => Math.max(Number.parseFloat(v) || this.max, this.min),
                changed: () => this.value = this.value,
            },
            step: {
                set: v => Number.parseFloat(v) || .1,
            },
            showPercentage: { set: v => v === true },
            showValue: { set: v => v === true },
        });
    }

    ready()
    {
        let dragging = false;
        const box = this.shadow.querySelector('box');

        this.on('box > handle', {
            mousedown: (e) => dragging = true,
        })

        document.body.on({
            mousemove: e => {
                if(dragging === true)
                {
                    const rect = this.getBoundingClientRect();
                    const contained = this.vertical === true
                        ? rect.contains(rect.x + 1, e.y)
                        : rect.contains(e.x, rect.y + 1);

                    if(contained === true)
                    {
                        const rect = box.getBoundingClientRect();
                        const p = this.vertical === true
                            ? (e.y - rect.top) / rect.height
                            : (e.x - rect.left) / rect.width;
                        const s = 10 / (this.step / (this.max - this.min));

                        this._percentVal = Math.round(p * s) / s;
                    }
                }
            },
            mouseup: e => dragging = false,
            mouseleave: e => dragging = false,
        });
    }
}
