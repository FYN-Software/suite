import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

const color = Types.Object.define({
    hue: Types.Number.min(0).max(360).default(180),
    saturation: Types.Number.min(0).max(1).default(0),
    lightness: Types.Number.min(0).max(1).default(.2),
    alpha: Types.Number.min(0).max(1).default(1),
});

export default class Color extends Fyn.Component
{
    static get properties()
    {
        return {
            label: new Types.String,
            value: new color,
        };
    }

    initialize()
    {
        this.observe({
            value: (o, n) => {
                const { hue, saturation, lightness, alpha } = this.value;

                console.log(this.value);

                this.style.setProperty('--value', `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`);

                this.emit('change', { old: o, new: n });
            },
        });
    }

    ready()
    {
        let editedValue = Object.assign({}, this.value);

        this.on('value', {
            click: Fyn.Event.debounce(10, (e, t) => {
                console.log(e);

                editedValue = Object.assign({}, this.value);
                const { hue, saturation, lightness, alpha } = editedValue;

                const rect = t.getBoundingClientRect();

                this.style.setProperty('--x', `${rect.x}px`);
                this.style.setProperty('--y', `${rect.y}px`);
                this.style.setProperty('--hue', hue);
                this.style.setProperty('--sat', `${ saturation * 100 }%`);
                this.style.setProperty('--light', `${ lightness * 100 }%`);
                this.style.setProperty('--alpha', alpha);

                this.shadow.querySelector('fyn-common-form-slider[vertical]').value = hue;
                this.shadow.querySelector('fyn-common-form-slider[horizontal]').value = 1 - alpha;

                this.setAttribute('open', '');
            }),
        });

        this.on('box [action]', {
            click: Fyn.Event.debounce(10, (e, t) =>
            {
                switch(t.action)
                {
                    case 'submit':
                        this.value = Fyn.Extends.clone(editedValue);

                        break;
                }

                this.removeAttribute('open');
            }),
        });

        this.on('fyn-common-form-slider[vertical]', {
            change: (e, t) =>
            {
                editedValue.hue = t.value;

                this.style.setProperty('--hue', t.value);
            },
        });

        this.on('fyn-common-form-slider[horizontal]', {
            change: (e, t) =>
            {
                editedValue.alpha = 1 - t.value;

                this.style.setProperty('--alpha', 1 - t.value);
            },
        });
        let dragging = false;

        const box = this.shadow.querySelector('box > gradient');
        const position = e => {
            const rect = box.getBoundingClientRect();
            const contained = rect.contains(e.x, e.y);

            if(contained === true)
            {
                editedValue.saturation = (e.x - rect.left) / rect.width;
                editedValue.lightness = 1 - (e.y - rect.top) / rect.height;

                this.style.setProperty('--sat', `${ editedValue.saturation * 100 }%`);
                this.style.setProperty('--light', `${ editedValue.lightness * 100 }%`);
            }
        };

        this.on('box > gradient', {
            mousedown: e => {
                dragging = true;

                position(e);
            }
        });

        document.body.on({
            mousemove: e => {
                if(dragging === true)
                {
                    position(e);
                }
            },
            mouseup: e => dragging = false,
            mouseleave: e => dragging = false,
        });
    }
}
