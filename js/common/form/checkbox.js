import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Checkbox extends Fyn.Component
{
    static get properties()
    {
        return {
            toggle: false,
            checked: false,
            label: '',
        };
    }

    initialize()
{
        this.observe({
            checked: {
                set: v => v === true,
                changed: (o, n) =>
{
                    this.shadow.querySelector('box').attributes.setOnAssert(n, 'checked');

                    this.emit('change', { old: o, new: n });
                },
            },
        });
    }

    ready()
{
        this.on('box, label', {
            click: Fyn.Event.debounce(10, e =>
{
                this.checked = !this.checked;
            }),
        });
    }
}
