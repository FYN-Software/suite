import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

const color = Types.Object.define({
    hue: Types.Number.min(0).max(360).default(180),
    saturation: Types.Number.min(0).max(1),
    lightness: Types.Number.min(0).max(1).default(.2),
    alpha: Types.Number.min(0).max(1).default(1),
});

export default class Color extends Fyn.Component
{
    static localName = 'fyn-common-form-color';
    static styles = [ 'fyn.suite.base' ];

    static get properties()
    {
        return {
            label: Types.String,
            value: color,
        };
    }

    initialize()
    {
        this.observe({
            value: (o, n) => {
                const { hue, saturation, lightness, alpha } = this.value;

                this.style.setProperty('--value', `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`);

                this.emit('change', { old: o, new: n });
            },
        });
    }

    ready()
    {
        let editedValue = Object.assign({}, this.value);

        this.shadow.on('value', {
            click: (_, t) => {
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
            },
        });

        this.shadow.on('box [action]', {
            click: (e, t) =>
            {
                switch(t.action)
                {
                    case 'submit':
                        this.value = Fyn.Extends.clone(editedValue);

                        break;
                }

                this.removeAttribute('open');
            },
        });

        this.shadow.on('fyn-common-form-slider[vertical]', {
            change: (_, t) =>
            {
                editedValue.hue = t.value;

                this.style.setProperty('--hue', t.value);
            },
        });

        this.shadow.on('fyn-common-form-slider[horizontal]', {
            change: (_, t) =>
            {
                editedValue.alpha = 1 - t.value;

                this.style.setProperty('--alpha', 1 - t.value);
            },
        });
        let dragging = false;

        const box = this.shadow.querySelector('box > gradient');
        const position = (x, y) => {
            const rect = box.getBoundingClientRect();
            const contained = rect.contains(x, y);

            if(contained === true)
            {
                editedValue.saturation = (x - rect.left) / rect.width;
                editedValue.lightness = 1 - (y - rect.top) / rect.height;

                this.style.setProperty('--sat', `${ editedValue.saturation * 100 }%`);
                this.style.setProperty('--light', `${ editedValue.lightness * 100 }%`);
            }
        };

        this.shadow.on('box > gradient', {
            options: {
                details: false,
            },
            mousedown: e => {
                dragging = true;

                position(e.x, e.y);
            }
        });

        document.body.on({
            options: {
                details: false,
            },
            mousemove: e => {
                if(dragging === true)
                {
                    position(e.x, e.y);
                }
            },
            mouseup: e => dragging = false,
            mouseleave: e => dragging = false,
        });
    }
}
