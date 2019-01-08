import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Collapsable extends Fyn.Component
{
    static get properties()
    {
        return { title: '' };
    }

    ready()
    {
        this.on('span[title], fyn-common-graphics-icon', { click: Fyn.Event.debounce(10, e => this.attributes.toggle('closed')) });
    }

    get open()
    {
        return this.hasAttribute('closed') === false;
    }
}
