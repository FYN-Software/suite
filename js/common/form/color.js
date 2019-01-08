import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Color extends Fyn.Component
{
    static get properties()
    {
        return {
            label: '',
            value: {
                hue: 180,
                saturation: 0,
                lightness: .2,
                alpha: 1,
            },
        };
    }

    initialize()
{
        this.observe({
            value: {
                changed: (o, n) =>
{
                    const { hue, saturation, lightness, alpha } = this.value;

                    this.style.setProperty('--value', `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`);

                    this.emit('change', { old: o, new: n });
                },
            },
        });
    }

    ready()
    {
        let editedValue = Fyn.Extends.clone(this.value);

        this.on('value', {
            click: Fyn.Event.debounce(10, (e, t) =>
{
                editedValue = Fyn.Extends.clone(this.value);
                const { hue, saturation, lightness, alpha } = editedValue;

                const rect = t.getBoundingClientRect();

                this.style.setProperty('--x', rect.x);
                this.style.setProperty('--y', rect.y);
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

        this.on('box > gradient > handle', { mousedown: e => dragging = true });

        document.body.on({
            mousemove: e =>
{
                if(dragging === true)
                {
                    const rect = box.getBoundingClientRect();
                    const contained = rect.contains(e.x, e.y);

                    if(contained === true)
                    {
                        editedValue.saturation = (e.x - rect.left) / rect.width;
                        editedValue.lightness = 1 - (e.y - rect.top) / rect.height;

                        this.style.setProperty('--sat', `${ editedValue.saturation * 100 }%`);
                        this.style.setProperty('--light', `${ editedValue.lightness * 100 }%`);
                    }
                }
            },
            mouseup: e => dragging = false,
            mouseleave: e => dragging = false,
        });
    }
}
